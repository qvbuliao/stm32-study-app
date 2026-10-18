# ============================================================
#  上传 STM32 五天速通 App 到 GitHub
#  仓库：https://github.com/qvbuliao/stm32-study-app
# ============================================================
#  用法：右键本文件 → “使用 PowerShell 运行”
#        或双击同目录的「上传到GitHub.bat」

$ErrorActionPreference = 'Continue'
Set-Location -Path $PSScriptRoot

function Line($t = '') { Write-Host $t }
function Head($t) {
  Line ('=' * 60)
  Line ("  " + $t)
  Line ('=' * 60)
}

Clear-Host
Head '上传 STM32 五天速通 App 到 GitHub'
Line
Line '  仓库：https://github.com/qvbuliao/stm32-study-app'
Line
Line '  接下来会弹出浏览器窗口，请用 qvbuliao 账号登录并授权。'
Line '  授权完成后，本窗口会自动继续，不需要再做别的。'
Line
Line ('=' * 60)
Line
Read-Host '按回车开始推送'

# ---- 推送 ----
Line
Line '[1/2] 正在推送到 GitHub ...'
Line

& git push -u origin main
$code = $LASTEXITCODE

if ($code -ne 0) {
  Line
  Line '推送失败。常见原因：'
  Line '  · 浏览器窗口里没有完成登录 / 授权'
  Line '  · 网络不通，或仓库地址不对'
  Line '  · 之前授权过但账号不是 qvbuliao（需清掉旧凭证重试）'
  Line
  Line '把上面的报错截图发给 AI 即可。'
  Line
  Read-Host '按回车退出'
  exit 1
}

# ---- 成功 ----
Line
Line '[2/2] 推送成功！'
Line
& git log --oneline -2
Line
Head '下一步：开启 GitHub Pages'

Line '  1. 打开这个网址：'
Line '     https://github.com/qvbuliao/stm32-study-app/settings/pages'
Line
Line '  2. Source 选 "Deploy from a branch"'
Line '  3. Branch 选 main，目录选 / (root)，点 Save'
Line '  4. 等 1-2 分钟，手机访问：'
Line '     https://qvbuliao.github.io/stm32-study-app/'
Line
Line '  打开后在浏览器菜单选「添加到主屏幕」，就是一个 STM32 图标的 App，'
Line '  以后用流量、换 WiFi、甚至飞行模式都能用。'
Line
Read-Host '按回车退出'
