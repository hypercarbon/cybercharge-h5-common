<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomNavBar from './CustomNavBar.vue'
import SectionPanel from './SectionPanel.vue'
import SectionAssets from './SectionAssets.vue'
import CustomTable from './CustomTable.vue'
import StepTips from './StepTips.vue'
import TaskMapContainer from './TaskMapContainer.vue'
import SectionBottom from './SectionBottom.vue'

import PanelIcon2 from '@/assets/invite/icon/icon_title_panel_2.png'
import PanelIcon3 from '@/assets/invite/icon/icon_title_panel_3.png'
import PanelIcon4 from '@/assets/invite/icon/icon_title_panel_4.png'

import PanelContent2 from '@/assets/invite/bg/bg_content_2.png'
import PanelContent3 from '@/assets/invite/bg/bg_content_3.png'
import PanelContent4 from '@/assets/invite/bg/bg_content_4.png'
import {
  getInviterTasks,
  getStatTask,
  getTaskCompletionRecords,
  type InviterTaskInfo,
  type StatTaskInfo,
  type TaskCompletionRecords,
} from '@/services/invite'

import IconClose from '@/views/invite/Icon/icon_close.vue'

const inviterTaskInfo = ref<InviterTaskInfo>()
const ruleContent = ref<string>('')

const taskCompletionRecords = ref<TaskCompletionRecords[]>([])

const statTask = ref<StatTaskInfo | null>(null)

const sectionsBg = [
  new URL('@/assets/invite/bg/bg_section_2.png', import.meta.url).href,
  new URL('@/assets/invite/bg/bg_section_3.png', import.meta.url).href,
  new URL('@/assets/invite/bg/bg_section_4.png', import.meta.url).href,
]

const taskRulesModalShow = ref(false)

onMounted(async () => {
  _getStatTask()
  await _getInviterTasks()
  await _getTaskCompletionRecords()
})

const handleChangeRuleContent = (index: number) => {
  ruleContent.value = inviterTaskInfo.value?.items[index].rule ?? ''
}

const _getInviterTasks = async () => {
  await getInviterTasks().then(res => {
    inviterTaskInfo.value = res.data
    handleChangeRuleContent(0)
    // console.log(res)
  })
}

const _getTaskCompletionRecords = async () => {
  if (!inviterTaskInfo.value) return
  await getTaskCompletionRecords({
    task_id: inviterTaskInfo.value?.id,
    task_item_id: inviterTaskInfo.value?.items[0].id,
  }).then(res => {
    taskCompletionRecords.value = res.data
  })
}

const _getStatTask = async () => {
  await getStatTask().then(res => {
    console.log(res)
    statTask.value = res.data
  })
}
</script>

<template>
  <div class="scroll-view">
    <CustomNavBar />
    <SectionAssets :statTask="statTask" />

    <SectionPanel
      className="section2"
      title="Friend invitation mission"
      :bgImgSource="sectionsBg[0]"
      :titleIcon="PanelIcon2"
      :contentImgSource="PanelContent2"
      :height="469"
      extraText="Rules"
      @click-extra="taskRulesModalShow = true"
    >
      <TaskMapContainer
        v-if="inviterTaskInfo"
        :inviterTaskInfo="inviterTaskInfo"
        @changeTab="handleChangeRuleContent"
      />
    </SectionPanel>

    <SectionPanel
      className="section3"
      title="Rebate explanation"
      :bgImgSource="sectionsBg[1]"
      :titleIcon="PanelIcon3"
      :contentImgSource="PanelContent3"
      :height="550"
      extraText="explanation"
    >
      <CustomTable :data="taskCompletionRecords" />
    </SectionPanel>

    <SectionPanel
      className="section4"
      title="Activity steps"
      :bgImgSource="sectionsBg[2]"
      :titleIcon="PanelIcon4"
      :contentImgSource="PanelContent4"
      :height="287"
    >
      <StepTips />
    </SectionPanel>

    <SectionBottom />

    <van-dialog
      class="rule-dialog"
      :showConfirmButton="false"
      v-model:show="taskRulesModalShow"
    >
      <IconClose class="ic_close" @click="taskRulesModalShow = false" />
      <div class="content" v-html="ruleContent"></div
    ></van-dialog>
  </div>
</template>

<style scoped>
.scroll-view {
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background-color: black;
}
</style>

<style>
.rule-dialog {
  padding: 24px;
  border-radius: 8px;
  width: 311px;
  background-color: #eaf1fd;
  background-image: url('@/assets/start/bg_modal_header_succ.png');
  background-size: contain;
  background-repeat: no-repeat;
  .van-dialog__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .ic_close {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .content {
      margin-top: 12px;
      height: 280px;
      overflow: auto;
    }
  }
}
</style>
