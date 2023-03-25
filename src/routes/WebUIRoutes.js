import express from 'express'
const router = express.Router()
import webUIController from '../controllers/WebUIController.js'

// router.use(webUIController.setSettings) // ilk olmalı buradaki currentLng setCurrenLang da kullanılıyor
// router.use(webUIController.setCurrentLang)
// router.use(webUIController.setLayoutContents)
// router.use(webUIController.setNavigations)
// router.use(webUIController.setLanguageCode)
router.get('/', webUIController.homePage)
router.get('/hakkimizda', webUIController.aboutPage)
router.get('/iletisim', webUIController.contactPage)
router.get('/turlar', webUIController.toursPage)
router.get('/tur-detay/:url', webUIController.tourSinglePage)
router.get('/blog', webUIController.blogsPage)
router.get('/blog-detay/:url', webUIController.blogSinglePage)

router.get('/404', webUIController.page404) 

router.post('/teklif-kayit', webUIController.offerAjax) 
router.post('/url-kayit', webUIController.siteURLAjax) 
router.post('/seo-analiz', webUIController.seoAnalysisAjax) 
router.post('/bulten-kayit', webUIController.bulletinSaveAjax) 

router.get("/seo-yapilanmasi-web-sitesi-icin-en-iyi-pratikler", webUIController.blog1)
router.get("/web-sitesi-nedir", webUIController.blog2)
router.get("/blog-3", webUIController.blog3)

export default router;