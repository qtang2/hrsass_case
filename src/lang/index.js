import VueI18n from 'vue-i18n'
import Vue from 'vue'
import Cookie from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from '@/lang/zh'
import customEN from '@/lang/en'

Vue.use(VueI18n)

export default new VueI18n({
  locale: Cookie.get('language') || 'zh', // current multi language type, any string show which language we have
  // current language packages
  messages: {
    zh: {
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }
  }

})
