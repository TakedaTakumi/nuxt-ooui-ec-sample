FROM node:26-bookworm-slim

# ユーザー名を引数で受け取る(docker-compose.yml の args から渡される)
# node:XX-bookworm-slim は既定で node ユーザー(UID 1000)を持つので、デフォルトも node にしておく
ARG APP_USER=node

# corepack の対話プロンプトを抑止(tty: true 環境で起動時にハングするのを防ぐ)
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# corepack のキャッシュ/ダウンロード先を allowWrite 対象配下に固定する。
# 既定の ~/.cache/node/corepack は sandbox の allowWrite に含まれず、
# corepack の書込が EROFS で失敗して pnpm が全滅するため。
# ~/.local/share/pnpm/** は .claude/settings.json の allowWrite 対象なので書込可能。
ENV COREPACK_HOME=/home/${APP_USER}/.local/share/pnpm/corepack

# 基本パッケージ
# bubblewrap / socat は Claude Code の sandbox(bash 隔離)に必須。
# bubblewrap: ファイルシステム/プロセス隔離、socat: ネットワークリレー。
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    sudo \
    procps \
    bubblewrap \
    socat \
    && rm -rf /var/lib/apt/lists/*

# APP_USER に sudo 権限を付与(権限調整用、NOPASSWD)
RUN echo "${APP_USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# corepack を有効化(/usr/local/bin/ に pnpm シンボリックリンクを作るので root で実行)
# pnpm の具体的なバージョンは package.json の `packageManager` フィールドが唯一のソース。
# corepack は実行時にそれを参照してダウンロード・キャッシュする(初回のみ数秒)。
# Node 25 以降は corepack が本体に同梱されなくなったため、明示的にインストールしてから有効化する。
# corepack 自体もビルド再現性のためバージョンを固定する(上げるときはこの行を書き換える)。
RUN npm install -g corepack@0.35.0 && corepack enable

# 名前付き volume のマウント先を APP_USER 所有で先に作っておく
# (これをしないと Docker が volume を root 所有で初期化してしまい、
#  node ユーザーから書き込めなくなる)
RUN mkdir -p /nuxt-ooui-ec-sample/node_modules /home/${APP_USER}/.local/share/pnpm/store \
    && chown -R ${APP_USER}:${APP_USER} /nuxt-ooui-ec-sample /home/${APP_USER}/.local

# APP_USER に切り替え(以降はこのユーザーで実行)
USER ${APP_USER}

# Claude Code をグローバルインストール(APP_USER 権限)
RUN npm config set prefix "/home/${APP_USER}/.npm-global"
ENV PATH=/home/${APP_USER}/.npm-global/bin:$PATH
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /nuxt-ooui-ec-sample

# package.json の packageManager 由来で pnpm をイメージにキャッシュ(焼き込み)する。
# sandbox 下では registry 到達不可で corepack が pnpm を DL できず `pnpm install` が
# 起動前に失敗する。ビルドは sandbox 外=registry 到達可なのでここで焼いておけば
# 実行時(sandbox 下)は DL 不要。
# `corepack install`(バージョン無指定)は package.json の packageManager を唯一のソースとして
# 参照するため「corepack prepare で二重管理しない」制約と両立する。
# COREPACK_HOME(~/.local/share/pnpm/corepack)は named volume 対象外(store のみ volume)
# なので、焼いたキャッシュは実行時もイメージ層として残る。
COPY --chown=${APP_USER}:${APP_USER} package.json ./
RUN corepack install
