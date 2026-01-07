---
title: "STM32-i^2C"
published: 2024-12-19
tags: []
category: "嵌入式STM32"
draft: false
---
<h1>i^2C</h1>
<h2>EEPROM i^2C</h2>
<ul>
<li>存关键参数</li>
<li>pid控制参数</li>
</ul>
<h2>FLASH：spi接口 10mb/s</h2>
<ul>
<li>容量比较大</li>
<li>用作数据代码存储</li>
<li>先擦后写（擦->FFFFF)</li>
</ul>
<p>　　‍</p>
<h1>I2C</h1>
<p>　　串行、<strong>半双工</strong>的总线，主要用于近距离、低速的芯片之间的通信；I2C总线有两根双向的信号线，一根数据线SDA用于收发数据，一根时钟线SCL用于通信双方时钟的同步</p>
<h2>通信过程</h2>
<ol>
<li>主机发送起始信号启用总线</li>
<li>主机发送一个字节数据指明从机地址和后续字节的传送方向</li>
<li>被寻址的从机发送应答信号回应主机</li>
<li>发送器发送一个字节数据</li>
<li>接收器发送应答信号回应发送器</li>
<li>........ （循环步骤4、5）</li>
<li>通信完成后主机发送停止信号释放总线</li>
</ol>
<p>　　第4步和第5步用的是发送器和接收器，不是主机和从机，这是由第一个字节的最后一位决定主给从发，还是从给主发。</p>
<p>　　也就是说，第一个字节和最后的停止信号一定是主机发给从机，但中间就不一定了。</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192134265.png" alt="image-20241121181856-lc999fm" />​</p>
<p>　　‍</p>
<p>　　起始信号 高到低跳变</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　这次实验用GPIO模拟时序</p>
<p>　　AT 24C02</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192134503.png" alt="image-20241121182405-zj731q9" />​</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192134748.png" alt="image-20241121182549-dajy4dt" />​</p>
<p>　　地址：0xA1	0xA0</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192134987.png" alt="image-20241121182640-qgbueo4" />​</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　用GPIO模拟I2C时序</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　myiic.c 文件存放 iic 驱动代码，24cxx.c 文件存放 24C02 驱动代码</p>
<p>　　‍</p>
<p>　　iic</p>
<pre><code class="language-c">//²úÉúIICÆðÊ¼ÐÅºÅ
void IIC_Start(void)
{
	SDA_OUT();     //sdaÏßÊä³ö
	IIC_SDA=1;	  	  
	IIC_SCL=1;
	delay_us(4);
 	IIC_SDA=0;//START:when CLK is high,DATA change form high to low 
	delay_us(4);
	IIC_SCL=0;//Ç¯×¡I2C×ÜÏß£¬×¼±¸·¢ËÍ»ò½ÓÊÕÊý¾Ý 
}	  
//²úÉúIICÍ£Ö¹ÐÅºÅ
void IIC_Stop(void)
{
	SDA_OUT();//sdaÏßÊä³ö
	IIC_SCL=0;
	IIC_SDA=0;//STOP:when CLK is high DATA change form low to high
 	delay_us(4);
	IIC_SCL=1; 
	IIC_SDA=1;//·¢ËÍI2C×ÜÏß½áÊøÐÅºÅ
	delay_us(4);							   
}
</code></pre>
<p>　　if(READ_SDA)receive++;//根据总线高低，来读</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192134256.png" alt="image-20241121184341-2upqtyy" />​</p>
