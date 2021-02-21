# 部署

## 使用 docker-compose 进行部署

1. 新建一个目录 yireader 并进入其中。（对于群晖来说，推荐放到 /volume1/docker/ 里）
   - `mkdir yireader && cd yireader`
2. 布置环境
   - 下载 [docker-compose.yml](https://github.com/uhziel/yireader/blob/main/docker-compose.yml)
     - `curl -OL https://cdn.jsdelivr.net/gh/uhziel/yireader/docker-compose.yml`
   - 准备数据库目录
     - `mkdir dbdata`
3. 启动应用
   - `sudo docker-compose up -d`
   - 其他维护指令请参见 [docker-compose.yml](https://github.com/uhziel/yireader/blob/main/docker-compose.yml) 中的注释
4. 开始体验
   - 打开 http://<机器ip>:3001 查看是否部署成功
