[English](DEEPENING.md) · [简体中文](DEEPENING.zh-CN.md)

# Deepening

在已知一个 shallow modules 集群的依赖关系的情况下，如何安全地把它做深。默认你已经掌握 [SKILL.md](SKILL.md) 里的词汇——**module**、**interface**、**seam**、**adapter**。

## Dependency categories

评估一个做深的候选对象时，先给它的依赖分类。这个类别决定了做深之后的模块要如何跨 seam 测试。

### 1. In-process

纯计算、内存中的状态、没有 I/O。总是可以做深——合并这些模块，直接通过新接口测试。不需要 adapter。

### 2. Local-substitutable

拥有本地测试替身的依赖（Postgres 用 PGLite，文件系统用 in-memory filesystem）。如果替身存在，就可以做深。做深后的模块用测试套件里跑着的替身来测试。Seam 是内部的；模块的外部接口上不需要 port。

### 3. Remote but owned（端口与适配器 / Ports & Adapters）

你自己拥有、但跨越网络边界的服务（微服务、内部 API）。在 seam 处定义一个 **port**（接口）。Deep module 拥有逻辑；传输层作为一个 **adapter** 被注入进来。测试用 in-memory adapter。生产环境用 HTTP/gRPC/队列 adapter。

推荐写法大致是："在这个 seam 处定义一个 port，为生产环境实现一个 HTTP adapter，为测试实现一个 in-memory adapter，这样即使部署跨越了网络，逻辑依然集中在一个 deep module 里。"

### 4. True external（Mock）

你不掌控的第三方服务（Stripe、Twilio 等）。做深后的模块把这个外部依赖当作一个被注入的 port 来接受；测试提供一个 mock adapter。

## Seam discipline

- **一个 adapter 意味着一个假想的 seam。两个 adapter 才意味着一个真实的 seam。** 除非至少有两个 adapter 是站得住脚的（通常是生产 + 测试），否则不要引入一个 port。只有一个 adapter 的 seam只是多了一层间接。
- **内部 seams vs 外部 seams。** 一个 deep module 既可以有内部 seams（对它自己的实现私有，只被自己的测试使用），也可以有位于接口处的外部 seam。不要仅仅因为测试在用内部 seams，就通过接口把它们暴露出去。

## Testing strategy: replace, don't layer

- 一旦做深后的模块接口上已经有了测试，原来针对 shallow modules 的旧单元测试就成了浪费——删掉它们。
- 在做深后的模块接口处写新测试。**接口就是测试面。**
- 测试要断言通过接口可观察到的结果，而不是内部状态。
- 测试应该在内部重构后依然存活——它们描述的是行为，不是实现。如果实现一变测试就要跟着改，说明这个测试测到了接口之后的东西。
