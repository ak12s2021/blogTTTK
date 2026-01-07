---
title: "STM32-SPI"
published: 2024-12-19
tags: []
category: "嵌入式STM32"
draft: false
---
<h1>SPI</h1>
<p>　　SPI---》写进去  w25q128--》液晶读取 断电 且可以累积</p>
<p>　　黑匣子</p>
<p>　　先擦后写（擦->FFFFF</p>
<p>　　‍</p>
<p>　　<strong>SCK(Serial Clock)</strong> ：SCK是串行时钟线，作用是Master向Slave传输时钟信号，控制数据交换的时机和速率；<br />
  <strong>MOSI(Master Out Slave in)</strong> ：在SPI Master上也被称为Tx-channel，作用是SPI主机给SPI从机发送数据；<br />
  <strong>CS/SS(Chip Select/Slave Select)</strong> ：作用是SPI Master选择与哪一个SPI Slave通信，低电平表示从机被选中(低电平有效)；<br />
  <strong>MISO(Master In Slave Out)</strong> ：在SPI Master上也被称为Rx-channel，作用是SPI主机接收SPI从机传输过来的数据；NSS--片选---</p>
<p>　　SCl</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192136272.png" alt="image-20241128181059-0xs8sn4" />​</p>
<p>　　‍</p>
<p>　　读--需要假写，给它移位出来</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192136535.png" alt="image-20241128182755-r00tz3l" />​</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192136798.png" alt="image-20241128183057-dun44s6" />​</p>
<p>　　128MB--------256block-64kb-----16sec-4kb</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192136071.png" alt="image-20241128183501-y1lge08" />​</p>
<p>　　读数据03h</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192136342.png" alt="image-20241128184811-zffoki7" />​</p>
<p>　　90h读指令</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192136561.png" alt="image-20241128185540-3600ycx" />​</p>
<p>　　删除整删区</p>
