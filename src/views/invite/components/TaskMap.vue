<template>
  <div class="flow-panel">
    <div
      v-for="(rowItem, rowIndex) in rowList"
      :key="rowIndex"
      :class="{
        'list-li': (rowIndex + 1) % 2 === 1,
        'reverse-li': (rowIndex + 1) % 2 === 0,
        'list-first-row': rowIndex === 0,
        'list-last-row': rowIndex === rowList.length - 1,
      }"
    >
      <div
        v-for="(node, nodeIndex) in rowItem"
        :key="node.time"
        class="node"
        :class="{
          'row-first-node': nodeIndex === 0,
          'row-last-node': nodeIndex === rowItem.length - 1,
          'curr-node': node.status === 1,
        }"
      >
        <div class="node-item">
          <div class="img-gem-bg">
            <div class="img-bg">
              <img class="img-light" :src="ImgLight" alt="" />
              <img class="img-bg-inner" :src="ImgGemBg" alt="" />
              <img class="img-gem" :src="ImgGem" alt="" />
              <span class="gem-num">{{ node.gem }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ImgGemBg from '@/assets/invite/map/gem_bg.png'
import ImgGem from '@/assets/invite/img_gem.png'
import ImgLight from '@/assets/invite/map/bg_light.png'
import type { InviterTaskItem, InviterTaskItemConfig } from '@/services/invite'

const props = defineProps<{
  inviterTaskItemConfig: InviterTaskItemConfig[]
}>()

const rowList = ref<any[]>([])

const list = ref([
  {
    time: '1',
    status: 1,
    gem: '100',
  },
  {
    time: '2',
    status: 1,
    gem: '100',
  },
  {
    time: '3',
    status: 1,
    gem: '100',
  },
  {
    time: '4',
    status: 0,
    gem: '100',
  },
  {
    time: '5',
    status: 0,
    gem: '100',
  },
  {
    time: '6',
    status: 0,
    gem: '100',
  },
  {
    time: '7',
    status: 0,
    gem: '100',
  },
  {
    time: '8',
    status: 0,
    gem: '100',
  },
])

onMounted(() => {
  let rowListTemp = []
  let currentIndex = 0
  let useThree = true // 交替使用3/2的标记

  while (currentIndex < list.value.length) {
    // 动态决定当前分片大小
    const chunkSize = useThree ? 3 : 2
    const end = currentIndex + chunkSize

    // 获取当前分片（自动处理结尾不足的情况）
    const chunk = list.value.slice(currentIndex, end)
    rowListTemp.push(chunk)

    // 移动索引并切换标记
    currentIndex = end
    useThree = !useThree
  }

  rowList.value = rowListTemp
  console.log(rowList.value)

  console.log(props.inviterTaskItemConfig)
})
</script>

<style scoped>
.flow-panel {
  /* 节点样式 */
  .node {
    flex: 1;
    /* border: 1px solid red; */
    text-align: center;
    position: relative;
    height: 80px;

    .node-item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .img-gem-bg {
        width: 52px;
        .img-bg {
          position: relative;
          width: 100%;
          z-index: 1;
          .img-light {
            width: 76px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            opacity: 0;
            animation: light 2s linear infinite;
          }
          .img-bg-inner {
            width: 100%;
          }
          .img-gem {
            width: 34px;
            position: absolute;
            left: 50%;
            top: 8px;
            transform: translate(-50%);
            z-index: 2;
          }
          .gem-num {
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: #000;
            font-size: 16px;
            font-weight: 800;
          }
        }

        &::before {
          position: absolute;
          top: 50%;
          left: -4px;
          margin-top: -6px;
          content: '';
          width: 56px;
          height: 6px;
          border-radius: 99px;
          background-color: #eaf1fd;
          display: block;
        }
        &::after {
          position: absolute;
          top: 50%;
          right: -4px;
          margin-top: -6px;
          content: '';
          width: 56px;
          height: 6px;
          border-radius: 99px;
          background-color: #eaf1fd;
          display: block;
        }
      }
    }
    &.curr-node {
      .node-item {
        .img-gem-bg {
          .img-bg {
            .img-light {
              opacity: 255;
            }
          }
          &::before,
          &::after {
            background-color: #9059ff;
          }
        }
      }
    }
  }
  /* 正向排列 */
  .list-li {
    display: flex;
    justify-content: start;
    &.list-first-row {
      .row-first-node {
        .node-item {
          .img-gem-bg {
            &::before {
              display: none;
            }
          }
        }
      }
    }
    &.list-last-row {
      .row-last-node {
        .node-item {
          .img-gem-bg {
            &::after {
              display: none;
            }
          }
        }
      }
    }

    .row-first-node {
      .node-item {
        .img-gem-bg {
          &::before {
            transform: rotateZ(-90deg);
            transform-origin: right;
            top: -42px;
          }
        }
      }
    }
    .row-last-node {
      .node-item {
        .img-gem-bg {
          &::after {
            transform: rotateZ(90deg);
            transform-origin: left;
            top: 66px;
          }
        }
      }
    }
  }

  /* 反向排列 */
  .reverse-li {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    justify-content: center;
    .row-first-node {
      .node-item {
        .img-gem-bg {
          .img-bg {
            transform: translateX(-25px);
          }
          &::after {
            right: 50px;
          }
        }
      }
    }
    .row-last-node {
      .node-item {
        .img-gem-bg {
          &::before {
            left: 50px;
          }
          .img-bg {
            transform: translateX(25px);
          }
        }
      }
    }
  }
}

@keyframes light {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
