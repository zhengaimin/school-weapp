const fs = require('node:fs')

const file = 'd:/Code/weapp/school-weapp/.agent/weapp.pen'
const data = JSON.parse(fs.readFileSync(file, 'utf8'))

const videoCard = data.children[0].children.find(c => c.id === 'card-video')
const dryerCard = data.children[0].children.find(c => c.id === 'card-dryer')

videoCard.children.push({ type: 'rectangle', width: 'fill_container', height: 1, fill: '#f3f4f6' })
videoCard.children.push({
  id: 'cv-gifts-section',
  type: 'frame',
  layout: 'vertical',
  width: 'fill_container',
  gap: 12,
  children: [
    {
      type: 'frame',
layout: 'horizontal',
width: 'fill_container',
justifyContent: 'space_between',
alignItems: 'center',
      children: [
        { type: 'text', content: '赠时长', fontSize: 14, fontWeight: 'bold', fill: '#374151' },
        { type: 'text', content: '共 2 条', fontSize: 12, fill: '#9ca3af' },
      ],
    },
    {
      type: 'frame',
layout: 'vertical',
width: 'fill_container',
fill: '#f9fafb',
cornerRadius: 8,
padding: [8, 12],
gap: 12,
      children: [
        {
          type: 'frame',
layout: 'horizontal',
width: 'fill_container',
justifyContent: 'space_between',
alignItems: 'center',
          children: [
             { type: 'text', content: '开学礼包', fontSize: 14, fill: '#4b5563' },
             { type: 'frame', layout: 'horizontal', gap: 8, alignItems: 'center', children: [
                 { type: 'text', content: '剩 30 分钟', fontSize: 12, fontWeight: 'bold', fill: '#2563eb' },
                 { type: 'rectangle', width: 1, height: 10, fill: '#d1d5db' },
                 { type: 'text', content: '3天后过期', fontSize: 12, fill: '#ea580c' },
             ] },
          ],
        },
        { type: 'rectangle', width: 'fill_container', height: 1, fill: '#e5e7eb' },
        {
          type: 'frame',
layout: 'horizontal',
width: 'fill_container',
justifyContent: 'space_between',
alignItems: 'center',
          children: [
             { type: 'text', content: '周常福利', fontSize: 14, fill: '#4b5563' },
             { type: 'frame', layout: 'horizontal', gap: 8, alignItems: 'center', children: [
                 { type: 'text', content: '剩 15 分钟', fontSize: 12, fontWeight: 'bold', fill: '#2563eb' },
                 { type: 'rectangle', width: 1, height: 10, fill: '#d1d5db' },
                 { type: 'text', content: '30天后过期', fontSize: 12, fill: '#9ca3af' },
             ] },
          ],
        },
      ],
    },
  ],
})

dryerCard.children.push({ type: 'rectangle', width: 'fill_container', height: 1, fill: '#f3f4f6' })
dryerCard.children.push({
  id: 'cd-gifts-section',
  type: 'frame',
  layout: 'vertical',
  width: 'fill_container',
  gap: 12,
  children: [
    {
      type: 'frame',
layout: 'horizontal',
width: 'fill_container',
justifyContent: 'space_between',
alignItems: 'center',
      children: [
        { type: 'text', content: '赠费', fontSize: 14, fontWeight: 'bold', fill: '#374151' },
        { type: 'text', content: '共 1 条', fontSize: 12, fill: '#9ca3af' },
      ],
    },
    {
      type: 'frame',
layout: 'vertical',
width: 'fill_container',
fill: '#f9fafb',
cornerRadius: 8,
padding: [8, 12],
gap: 12,
      children: [
        {
          type: 'frame',
layout: 'horizontal',
width: 'fill_container',
justifyContent: 'space_between',
alignItems: 'center',
          children: [
             { type: 'text', content: '充值满赠', fontSize: 14, fill: '#4b5563' },
             { type: 'frame', layout: 'horizontal', gap: 8, alignItems: 'center', children: [
                 { type: 'text', content: '剩 ¥5.00', fontSize: 12, fontWeight: 'bold', fill: '#2563eb' },
                 { type: 'rectangle', width: 1, height: 10, fill: '#d1d5db' },
                 { type: 'text', content: '永久有效', fontSize: 12, fill: '#9ca3af' },
             ] },
          ],
        },
      ],
    },
  ],
})

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
