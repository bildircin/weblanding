import { Op, Sequelize } from "sequelize"
import Tour from '../models/Tour.js'
import moment from 'moment'
import { serializeList, dhm } from "../../globalFunctions.js"
import LanguageItem from '../models/LanguageItem.js'
import LanguageCode from '../models/LanguageCode.js'
import PageContent from '../models/PageContent.js'
import Navigation from "../models/Navigation.js"
import Category from "../models/Category.js"
import Blog from "../models/Blog.js"
import Offer from "../models/Offer.js"
import Bulletin from "../models/Bulletin.js"
import SiteURL from "../models/SiteURL.js"
import SeoAnalysis from "../models/SeoAnalysis.js"
import TourCategory from "../models/TourCategory.js"
import db from '../../db.js'
import Setting from "../models/Setting.js"
import flatCache from 'flat-cache'
import SharedImage from "../models/SharedImage.js"
import {convert} from "html-to-text"

let cache = flatCache.load('webUIController')
let currentLang = {
    lng:'tr',
    languageTitle:'Türkçe'
}
let contents = {}
let navigations = []
let languageCodes = []
let settings;

//middleware
const setSettings = async (req,res,next)=>{
    settings = cache.getKey('settings')
    if (!settings) {
        settings = await Setting.findAll()
        cache.setKey('settings', settings)
        cache.save()
    }

    res.locals.title = settings.find(el=>el.key == 'uiMetaTitle').value
    res.locals.uiMetaDescription = settings.find(el=>el.key == 'uiMetaDescription').value
    res.locals.uiMetaKeywords = settings.find(el=>el.key == 'uiMetaKeywords').value
  
    next()
}
const setCurrentLang = async (req,res,next)=>{
   
    let uiCurrentLanugage = settings.find(el=>el.key == 'uiCurrentLanugage')
    if(uiCurrentLanugage.value){
        let languageCode = await cache.getKey('languageCode')
        if (!languageCode) {
             languageCode = await LanguageCode.findOne({
                where:{
                    lng:uiCurrentLanugage.value
                }
            })
            cache.setKey('languageCode', languageCode)
            cache.save()
        }
        if(languageCode){
            currentLang.languageTitle = languageCode.name
            currentLang.lng = languageCode.lng
        }
    }
    if(req.cookies.lng){
        currentLang.lng = req.cookies.lng
    }
    if(req.cookies.languageTitle){
        currentLang.languageTitle = req.cookies.languageTitle
    }

    let languageItems = await cache.getKey('languageItems')
    if (!languageItems) {
        languageItems = await LanguageItem.findAll({
            where:{
                lng:currentLang.lng
            }
        })
        cache.setKey('languageItems', languageItems)
        cache.save()
    }

    languageItems.forEach(item => {
        currentLang[item.key] = item.value
    })
   
    next()
}
const setLayoutContents = async (req,res,next)=>{

    let layoutHeaderBonusLeft = await cache.getKey('layoutHeaderBonusLeft')
    if (!layoutHeaderBonusLeft) {
        layoutHeaderBonusLeft = await PageContent.findOne({
            where:{
                key:'layoutHeaderBonusLeft',
                languageCode:currentLang.lng
            }
        })
        cache.setKey('layoutHeaderBonusLeft', layoutHeaderBonusLeft)
        cache.save()
    }
    if(layoutHeaderBonusLeft){
        contents.layoutHeaderBonusLeft = layoutHeaderBonusLeft.value
    }
    next()
}
const setNavigations = async (req,res,next)=>{

    let localNavigations = await cache.getKey('localNavigations')
    if (!localNavigations) {
        localNavigations = await Navigation.findAll({
            where:{
                isActive:true,
                isDeleted:false
            }
        })
        cache.setKey('localNavigations', localNavigations)
        cache.save()
    }

    navigations = [...serializeList(localNavigations)]
    next()
}

const setLanguageCode = async (req,res,next)=>{

    let localLanguageCodes = await cache.getKey('localLanguageCodes')
    if (!localLanguageCodes) {
        localLanguageCodes = await LanguageCode.findAll({
            where:{
                isActive:true
            }
        })
        cache.setKey('localLanguageCodes', localLanguageCodes)
        cache.save()
    }    
    languageCodes = localLanguageCodes
    next()
}









const homePage = async (req,res)=>{
    res.locals.title="Abaküs Yazılım | İzmir Web Site Yazılım"
    await res.render('webUI/index', {layout:'webUI/layout'})
}

const aboutPage = async (req,res)=>{
    res.locals.title="Hakkımızda"

    await res.render('webUI/about-us', {layout:'webUI/layout', currentLang, contents, navigations, languageCodes})
}

const contactPage = async (req,res)=>{
    res.locals.title="İletişim"

    await res.render('webUI/contact', {layout:'webUI/layout', currentLang, contents, navigations, languageCodes})
}

const toursPage = async (req,res)=>{
    res.locals.title="Turlar"

    let uiProductsItemsPerPage = settings.find(el=>el.key == 'uiProductsItemsPerPage').value

    //query
    const q = req.query;
    let tours = []
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = uiProductsItemsPerPage ? parseInt(uiProductsItemsPerPage) : 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let paginatedResults = {}

    if(q.hasOwnProperty('searchTour')){

        const tourCategories = await TourCategory.findAll({
            where:{
                categoryId:q.category == 'null' ? {[Op.ne]:null} : q.category
            }
        }).catch(err=>{
            console.log(err)
        })
        let tourIds = tourCategories.map(el => el.tourId)
        q.startedAt = q.startedAt != '' ? moment(q.startedAt, "MM/DD/YYYY").format('YYYY-MM-DD') : ''
        q.finishedAt = q.finishedAt != '' ? moment(q.finishedAt, "MM/DD/YYYY").format('YYYY-MM-DD') : ''

        let orderSort = ['id']
        if(q.sort && q.sort != 'null' && q.sort == 'az')
            orderSort = ['title', 'ASC']
        if(q.sort && q.sort != 'null' && q.sort == 'za')
            orderSort = ['title', 'DESC']
        if(q.sort && q.sort != 'null' && q.sort == 'high')
            orderSort = ['price', 'ASC']
        if(q.sort && q.sort != 'null' && q.sort == 'low')
            orderSort = ['price', 'DESC'] 
        if(q.sort && q.sort != 'null' && q.sort == 'near')
            orderSort = ['startedAt', 'ASC']
        if(q.sort && q.sort != 'null' && q.sort == 'far')
            orderSort = ['startedAt', 'DESC']
            
        let option = {
            where:{
                isActive:true,
                isDeleted:false,
                id:tourIds,
                startedAt:  q.startedAt != '' ? { [Op.gte]: moment(q.startedAt)} : {[Op.ne]: null},
                finishedAt: q.finishedAt != '' ? { [Op.lte]: moment(q.finishedAt) } : {[Op.ne]: null},
                persons: q.persons != '0' ? q.persons : {[Op.ne]: null},
                price: q.price != '' ? { [Op.lte]: q.price } : {[Op.ne]: null}
            },
            order:[
                orderSort
            ]
        }
        paginatedResults = await getPaginatedResults(Tour, option, limit, page, startIndex, endIndex)
        tours = await Tour.findAll({
            where:{
                isActive:true,
                isDeleted:false,
                id:tourIds,
                startedAt:  q.startedAt != '' ? { [Op.gte]: moment(q.startedAt)} : {[Op.ne]: null},
                finishedAt: q.finishedAt != '' ? { [Op.lte]: moment(q.finishedAt) } : {[Op.ne]: null},
                persons: q.persons != '0' ? q.persons : {[Op.ne]: null},
                price: q.price != '' ? { [Op.lte]: q.price } : {[Op.ne]: null}
            },
            order:[
                orderSort
            ],
            offset:startIndex,
            limit:limit
        })
    }else{
        let option = {
            where:{
                isActive:true,
                isDeleted:false
            }
        }
        paginatedResults = await getPaginatedResults(Tour, option, limit, page, startIndex, endIndex)

        tours = await Tour.findAll({
            where:{
                isActive:true,
                isDeleted:false
            },
            offset:startIndex,
            limit:limit
        })
    }

    const categories = await Category.findAll({
        where:{
            isActive:true,
            isDeleted:false
        }
    })

    const pageContents = await PageContent.findAll({
        where:{
            key:['toursBreadcrumb'],
            languageCode:currentLang.lng
        }
    }).catch(err=>{
        console.log(err)
    })

    await pageContents.forEach(item => {
        contents[item.key] = item.value
    });
    
    await res.render('webUI/tours', {layout:'webUI/layout', currentLang, contents, q, navigations, categories, tours, paginatedResults, languageCodes})
}

const tourSinglePage = async (req,res)=>{
    const url = req.params.url
    
    res.locals.title = ""
    const t = await db.transaction()
    try {
        const tour = await Tour.findOne({
            where:{
                url:url
            }
        }, {transaction: t})

        if(tour){
            res.locals.title = tour.title
        }
        await t.commit()
        await res.render('webUI/tour-single', {layout:'webUI/layout', currentLang, contents, navigations, languageCodes, tour})
    } catch (error) {
        console.log(error)
        await t.rollback()
    }
}

const blogsPage = async (req,res)=>{

    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 9
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const blogCount = await Blog.count({})
    const paginatedResults = {
        pageCount:Math.ceil(blogCount / limit),
        page
    }
    if (endIndex < blogCount) {
        paginatedResults.next = {
            page: page + 1
        }
    }
    if (startIndex > 0) {
        paginatedResults.previous = {
            page: page - 1
        }
    }
    const t = await db.transaction()
    
    try {
        let blogs = await Blog.findAll({
            offset:startIndex,
            limit:limit,
            where:{
                isActive:true
            },
            order:[
                ['releaseDate', 'DESC']
            ]
        }, {transaction: t})
        
        res.locals.title = "Blog"

        blogs = await blogs.map(el=>{
            let item = el
            item.description = convert(el.description).slice(0, 90)
            return item
        })

        await t.commit()
        await res.render('webUI/blogs', {layout:'webUI/layout', currentLang, contents, navigations, languageCodes, blogs, paginatedResults})
    } catch (error) {
        await t.rollback()
    }
}

const blogSinglePage = async (req,res)=>{
    const url = req.params.url
    
    res.locals.title = ""
    const t = await db.transaction()
    try {
        const blog = await Blog.findOne({
            where:{
                url:url
            }
        }, {transaction: t})

        if(blog){
            res.locals.title = blog.title
        }
        await t.commit()
        await res.render('webUI/blog-single', {layout:'webUI/layout', currentLang, contents, navigations, languageCodes, blog})
    } catch (error) {
        console.log(error)
        await t.rollback()
    }
}


const page404 = async (req,res,next)=>{
    res.locals.title = "Sayfa Bulunamadı"
    await res.render('webUI/404', {layout:'webUI/layout', currentLang, contents, navigations, languageCodes})
}



const blog1 = async (req,res,next) => {
    res.locals.title = "SEO Yapılanması: Web Sitesi İçin En İyi Pratikler | Abaküs Yazılım"
    await res.render("webUI/blogs/blog-1", {layout:"webUI/layout"})
}
const blog2 = async (req,res,next) => {
    res.locals.title = "Web Yazılımı Nedir? | Abaküs Yazılım"
    await res.render("webUI/blogs/blog-2", {layout:"webUI/layout"})
}
const blog3 = async (req,res,next) => {
    res.locals.title = ""
    await res.render("webUI/blogs/blog-3", {layout:"webUI/layout"})
}



const siteURLAjax = async (req,res,next)=>{
    let {url, email} = req.body
    email = email.trim()
    
    const t = await db.transaction()
    try {

        const duplicateSiteUrl = await SiteURL.findOne({
            where:{
                email,
                isReview:false
            }
        }, {transaction: t})

        if(duplicateSiteUrl){
            return res.send({isSuccess:false, message:'<strong>Başarısız!</strong>Henüz incelenmekte olan siteniz var.'})
        }
        
        const siteURL = await SiteURL.create({
            url,
            email,
            isReview:false,
            createdAt:moment(),
            updatedAt:moment()
        }, {transaction : t})

        await t.commit()
        await res.send({isSuccess:true, message:'<strong>Başarılı!</strong> Siteniz kaydedildi. Sizlere en kısa sürede dönüş sağlayacağız.'})
    } catch (err) {
        console.log(err)
        await t.rollback()
        await res.send({isSuccess:false, message:'<strong>Başarısız!</strong> Bir hata oluştu. Lütfen tekrar deneyiniz'})
    }
}

const offerAjax = async (req,res,next)=>{
    let {name, email, phone, description} = req.body
    
    if(phone != null || phone != undefined){
        phone = phone.trim()
    }
    if(phone == "" || phone == undefined){
        phone = null
    }

    const t = await db.transaction()
    try {
        const offer = await Offer.create({
            name,
            email,
            phone,
            description,
            createdAt:moment(),
            updatedAt:moment()
        }, {transaction : t})

        await t.commit()
        await res.send({isSuccess:true, message:'Teklif başarıyla oluşturuldu <br /> Sizlere en kısa zamanda dönüş yapacağız'})
    } catch (err) {
        console.log(err)
        await t.rollback()
        await res.send({isSuccess:false, message:'Bir hata oluştu. <br /> Sayfayı yenileyip tekrar deneyiniz'})
    }
}

const seoAnalysisAjax = async (req,res,next)=>{
    let {name, email, url, companyName} = req.body
    
    const t = await db.transaction()
    try {
        const seoAnalysis = await SeoAnalysis.create({
            name,
            email,
            url,
            companyName,
            createdAt:moment(),
            updatedAt:moment()
        }, {transaction : t})

        await t.commit()
        await res.send({isSuccess:true, message:'Kayıt başarıyla oluşturuldu <br /> Sizlere en kısa zamanda dönüş yapacağız'})
    } catch (err) {
        console.log(err)
        await t.rollback()
        await res.send({isSuccess:false, message:'Bir hata oluştu. <br /> Sayfayı yenileyip tekrar deneyiniz'})
    }
}

const bulletinSaveAjax = async (req,res,next)=>{
    const email = req.body.email

    const t = await db.transaction()
    try {

        const dublicateBulletin = await Bulletin.findOne({
            where:{
                email
            }
        })

        if (dublicateBulletin) {
            return res.send({isSuccess:false, message:'Bir hata oluştu. Lütfen tekrar deneyiniz'})
        }
        
        const bulletin = await Bulletin.create({
            email,
            createdAt:moment(),
            updatedAt:moment()
        })

        await t.commit()
        await res.send({isSuccess:true, message:'Kayıt başarıyla oluşturuldu'})
    } catch (err) {
        console.log(err)
        await t.rollback()
        await res.send({isSuccess:false, message:'Bir hata oluştu. Lütfen tekrar deneyiniz'})
    }
}



async function getPaginatedResults(model, option, limit, page, startIndex, endIndex){
    const modelCount = await model.count(option)
    
    let paginatedResults = {
        pageCount:Math.ceil(modelCount / limit),
        page
    }

    if (endIndex < modelCount) {
        paginatedResults.next = {
            page: page + 1
        }
    }

    if (startIndex > 0) {
        paginatedResults.previous = {
            page: page - 1
        }
    }
    return paginatedResults
}


export default {
    setCurrentLang,
    setLayoutContents,
    setNavigations,
    setLanguageCode,
    homePage,
    aboutPage,
    contactPage,
    toursPage,
    setSettings,
    tourSinglePage,
    blogsPage,
    blogSinglePage,
    page404,
    cache,

    offerAjax,
    siteURLAjax,
    seoAnalysisAjax,
    bulletinSaveAjax,
    blog1,
    blog2,
    blog3
}