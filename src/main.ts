import './assets/main.css'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router'

import i18n from './lang/i18n'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vant
import {
  Button,
  Toast,
  Col,
  Row,
  NavBar,
  Image as VanImage,
  Field,
  CellGroup,
  NumberKeyboard,
  Tab,
  Tabs,
  Icon,
  Form,
  Area,
  Popup,
  Uploader,
  DatePicker,
  PickerGroup,
  ActionSheet,
  FloatingPanel,
  Cell,
  Search,
  Cascader,
  Loading,
  Skeleton,
  SkeletonTitle,
  SkeletonImage,
  SkeletonAvatar,
  SkeletonParagraph,
  Dialog,
} from 'vant'

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.use(Button)
app.use(Toast)
app.use(Col)
app.use(Row)
app.use(NavBar)
app.use(VanImage)
app.use(Field)
app.use(CellGroup)
app.use(NumberKeyboard)
app.use(Tab)
app.use(Tabs)
app.use(Icon)
app.use(Form)
app.use(Area)
app.use(Popup)
app.use(Uploader)
app.use(PickerGroup)
app.use(DatePicker)
app.use(ActionSheet)
app.use(FloatingPanel)
app.use(Cell)
app.use(Search)
app.use(Cascader)
app.use(Loading)
app.use(Skeleton)
app.use(SkeletonTitle)
app.use(SkeletonImage)
app.use(SkeletonAvatar)
app.use(SkeletonParagraph)
app.use(Dialog)
app.mount('#app')
