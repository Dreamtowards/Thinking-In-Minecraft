# 前言

Minecraft 不需要介绍，但它需要解释。

它是史上最畅销的电子游戏，售出超过三亿份。它引爆了独立游戏运动，让"一个人业余时间写的游戏能卖出三亿份"从笑话变成事实。它还是互联网历史上第一个真正意义上的内容黑洞——从 2011 年中到 2014 年，将近三年时间里，你打开视频平台几乎无法避开它。对整整一代创作者来说，Minecraft 不是他们做的第一种内容，而是他们做的唯一一种内容。

人们用它复刻母校和故宫，也用它给去世的朋友建纪念碑。一个连人脸都画不清楚的游戏，成了很多人表达感情的地方。这件事本身就需要解释。

而这些数字很容易查到，也很容易被读成一句"它成功了"。可"成功"什么都没有解释。同期有画面更好的沙盒、系统更深的模拟器、宣发更猛的大作，它们都没有变成一种基础设施。为什么偏偏是这个由一个瑞典程序员用 Java 写出来的、贴图只有 16 像素、连目标都不给你的游戏？

更难回答的是后半个问题。

## 变冷的不是游戏

Minecraft 今天的销量、月活和票房都比 2014 年更高。所以"衰落"这个词用在它身上是不准确的——也正是这种不准确，让真正的问题一直被绕过去。

变冷的不是这个游戏，是围绕它的那台创造机器。

那台机器曾经是这样运转的：有人在自己的世界里造了点东西，拍成视频；看到视频的人照着造了一遍，然后开始改；改到不够用的时候，他去学写材质包、写数据包、写 mod、开服务器、写插件；他做出来的东西又变成别人的起点。十几年里，这条链子给这个游戏源源不断地供血，供的不只是内容，还有人。

今天这条链子的每一节都还在，但它们之间的咬合松了。这本书想弄清楚它是怎么松的，以及能不能重新咬上。

## 我为什么有资格写

我不是以研究者的身份写这本书的。

我小学开始玩 Minecraft，然后再没停下来。初中的时候我开了自己的服务器，给它写插件，写配套的管理工具——那大概是我第一次意识到，代码可以改变一个别人正在生活的世界。高中我开始学 OpenGL，用 Marching Cubes 做了一个"平滑版"的 Minecraft：没有方块的棱角，地形连续起伏。它跑起来的那一刻确实很漂亮，然后我花了更长的时间才明白，我亲手删掉的恰好是这个游戏最重要的东西。大学我写了一个 C++ 的 3D 物理引擎，做碰撞检测和约束求解，于是又一次从内部看清了 Minecraft 在物理上那些"简陋"的选择——它们中的绝大多数不是妥协，是判断。

<!-- 可补：那个服务器的名字、开服的年份、第一个插件解决的具体问题、平滑版跑起来时的截图 -->

十几年里我从三个高度看过同一个游戏：作为玩家，作为服主，作为引擎作者。这本书是这三个视角的合并。

## 我为什么要写

因为我要做另一个。

《以太效应 · AetherEffect》是我正在做的沙盒游戏：更写实的世界、把 Mod 与 UGC 当成一等公民而不是补丁、以及认真回答 AI 应该在创作里占什么位置。

这三件事听起来都像"把 Minecraft 做得更好"，而这恰恰是最危险的说法。过去十几年，几乎每一个死掉的 Minecraft-like 都是从这句话开始的——它们改进了画面、加深了系统、补齐了 Minecraft 明显的短板，然后发现自己造出了一个精致但不生长的世界。我高中那个平滑版就是这类失败的最小样本：我以为方块是妥协，其实方块是地基。

所以在写引擎之前，我需要先把 Minecraft 想清楚：每一处"简陋"背后压着什么约束，每一个约束又意外长出了什么。这本书首先是我逼自己想清楚的方式，其次才是给你看的。

## 这本书不是什么

- **不是攻略。** 这里不教你造刷怪塔，但会解释刷怪塔为什么能存在。
- **不是维基的重排。** 能查到的事实我会给出来，但事实本身不是内容，因果才是。
- **不是怀旧散文。** 怀旧在这本书里是一个需要被解释的现象，不是一种可以拿来收尾的情绪。
- **不是对 Mojang 的批评书。** 任何坐在那个位置上的公司都会做出类似的选择。真正值得写下来的，是"一连串合理的决定如何累积成一个不合理的结果"。

## 接下来

全书分四卷：它为何发生、它为何好玩、它如何做成、该如何重做。前三卷是举证，第四卷是我的答案。

四卷之间不是并列的分类，而是一条论证。这条论证到底是什么、以及你该怎么读它，写在下一章[《本书的命题》](./thesis)里。如果你只打算给这本书十分钟，就读那一章。

<div style="margin-top: 3rem; text-align: right;">

**Aether**
《以太效应 · AetherEffect》开发者

</div>

<!-- 可补：署名日期与地点 -->


<!--

================================================================
以下为早期草稿素材，保留备用，不参与渲染。
================================================================

Minecraft is a game that needs no introduction. it has taken the gaming world by storm, since its release back in 2011.

But what makes it so special? is it the vast open world waiting to be explored? the endless possibilities of creation? or the charming blocky graphics that make it so unique?

At its core, Minecraft is a game about survival and creativity. the player is tasked with gathering resources such as wood, stone and iron to craft tools and build shelters. As the player progress, they encounter new challenges such as dangerous mobs and need for more advanced resources.

One of the most impressive aspects of Minecraft is the Freedom it offers the player. from building simple dirt huts to massive castles and intricate redstone contraptions. the possibilities are truly endless.
The game's procedual generation also means that every new world is unique, with different biomes, structures and resources to discover.
But Minecraft isn't just about building and exploring.

One of the most enjoyable aspects of Minecraft is the ability to play with others. players can work together to build massive structures or engage in epic battles. this cooperative element adds a new level of depth and excitement to the game, and it's no wonder why Minecraft has become a cultureal phenomenon.

But perhaps the most touching aspect of Minecraft is how it allows players to express themselves in unique and meaningful ways.
from recreating famous landmarks, to building memorial for loved ones, the game has become a platform for creative expression and emotional catharsis.
Minecraft offers a glimmer of hope and a chance to connect with others in a profound way

本书深入探讨了Minecraft的设计哲学、历史背景以及核心算法。通过通俗易懂且直接的小示例，解释了一个个复杂抽象的概念。
适合各个层次的Minecraft爱好者阅读，同时也是高等院校讲授游戏设计和程序生成算法的绝佳教材和参考书。

-->
