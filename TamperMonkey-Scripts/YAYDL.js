// ==UserScript==
// @name Yet Another Youtube Downloader (MP3-FLAC)
// @name:de Yet Another Youtube Downloader (MP3-FLAC)
// @name:da Yet Another Youtube Downloader (MP3-FLAC)
// @name:fr Yet Another Youtube Downloader (MP3-FLAC)
// @name:ru Yet Another Youtube Downloader (MP3-FLAC)
// @name:uk Yet Another Youtube Downloader (MP3-FLAC)
// @name:pt-BR Yet Another Youtube Downloader (MP3-FLAC)
// @name:ja Yet Another Youtube Downloader (MP3-FLAC)
// @name:zh-CN Yet Another Youtube Downloader (MP3-FLAC)
// @description Utilizes loader.to to convert videos from Youtube to MP3 or FLAC.
// @version     1.0
// @date        2023-02-02
// @author      Thyrador
// @icon        https://i.imgur.com/bu8MIMk.jpg
// @icon64      https://i.imgur.com/bu8MIMk.jpg
// @include     https://www.youtube.com/*
// @include     https://youtu.be/*
// @run-at      document-end
// @grant       GM_listValues
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_notification
// @grant       GM_download
// @grant       GM.info
// @grant       GM.listValues
// @grant       GM.addStyle
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.openInTab
// @grant       GM.setClipboard
// @grant       GM.xmlHttpRequest
// @connect     youtube.com
// @connect     m.youtube.com
// @connect     www.youtube.com
// @connect     youtube-nocookie.com
// @connect     youtu.be
// @connect     loader.to
// @connect     self
// @connect     *
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @antifeature referral-link
// @match *://*.youtube.com/*
// ==/UserScript==
var YTDL = {
    oXHttpReq: null,
    vid: null,
    oldUrl: null,
    format: "flac",
    DocOnLoad: function(o) {
        try {
            GM_addStyle(`
                .lds-ring {
                    display: inline-block;
                    position: relative;
                    width: 15px;
                    height: 15px;
                }
                .lds-ring div {
                    box-sizing: border-box;
                    display: block;
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    margin-left: 4px;
                    border: 8px solid #fff;
                    border-radius: 50%;
                    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                    border-color: #fff transparent transparent transparent;
                }
                .lds-ring div:nth-child(1) {
                    animation-delay: -0.45s;
                }
                .lds-ring div:nth-child(2) {
                    animation-delay: -0.3s;
                }
                .lds-ring div:nth-child(3) {
                    animation-delay: -0.15s;
                }
                @keyframes lds-ring {
                    0% {
                    transform: rotate(0deg);
                    }
                    100% {
                    transform: rotate(360deg);
                    }
                }
                .yaydl-hidden {
                    display: none;
                }
                .yaydl-block {
                    cursor: not-allowed !important;
                }
            `);

            if (null != o && null != o.body && null != o.location && (YTDL.vid = YTDL.getVid(o), YTDL.vid)) {
                o.querySelector("#meta #notification-preference-button").setAttribute("style", "flex-wrap: wrap;");
                var t = o.querySelector("#notification-preference-button"),
                    e = o.querySelector("#ytconv-mp3"),
                    f = o.querySelector("#ytconv-flac"),
                    m = YTDL.GetCommandButton("mp3"),
                    n = YTDL.GetCommandButton("flac");
                null == e && (null != t ? t.parentNode.insertBefore(m, t) : (t = o.querySelector("#eow-title")).parentNode.insertBefore(m, t)), YTDL.oldUrl = o.location.href, YTDL.checkChangeVid();
                null == f && (null != t ? t.parentNode.insertBefore(n, t) : (t = o.querySelector("#eow-title")).parentNode.insertBefore(n, t)), YTDL.oldUrl = o.location.href, YTDL.checkChangeVid();
            }
            return !0
        } catch (o) {
            console.error("Error in function YTDL.DocOnLoad. ", o)
        }
    },
    checkChangeVid: function() {
        setTimeout(function() {
            YTDL.oldUrl == window.location.href ? YTDL.checkChangeVid() : YTDL.WaitLoadDom(window.document)
        }, 1e3)
    },
    WaitLoadDom: function(o) {
        YTDL.vid = YTDL.getVid(o), YTDL.vid ? null != o.querySelector("#meta #notification-preference-button") ? YTDL.DocOnLoad(o) : setTimeout(function() {
            YTDL.WaitLoadDom(o)
        }, 1e3) : YTDL.checkChangeVid()
    },
    goToYTDL: function(o, format) {
        try {
            Array.prototype.forEach.call(document.getElementsByClassName("yaydl-loading"), function(el) {
                el.classList.remove('yaydl-hidden');
                el.parentElement.setAttribute('disabled', '');
                el.parentElement.classList.add('yaydl-block');
            });

            YTDL.format = format;
            YTDL.DownloadAudio(`https://loader.to/ajax/download.php?format=${YTDL.format}&url=https%3A%2F%2Fyoutu.be%2F${YTDL.vid}`);
        } catch (o) {
            console.error("Error in function YTDL.goToYTDL. ", o)
        }
    },
    DownloadAudio: function(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var prgJSON = JSON.parse(response.responseText);
                YTDL.OpenAudioLink(`https://loader.to/ajax/progress.php?id=${prgJSON.id}`, prgJSON.title);
            }
        });
    },
    OpenAudioLink: function(url, title) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(prgresponse) {
                console.debug(prgresponse.responseText);
                var prgsJSON = JSON.parse(prgresponse.responseText);
                if(prgsJSON.success == 1)
                {
                    console.debug(prgsJSON.download_url, title);
                    var dla = document.createElement("a");
                    dla.id = "dla-download-link";
                    dla.setAttribute("href", prgsJSON.download_url);
                    dla.click();
                    dla.remove();
                    
                    Array.prototype.forEach.call(document.getElementsByClassName("yaydl-loading"), function(el) {
                        el.classList.add('yaydl-hidden');
                        el.parentElement.removeAttribute('disabled');
                        el.parentElement.classList.remove('yaydl-block');
                    });
                }
                else {
                    setTimeout(function() {
                        YTDL.OpenAudioLink(url, title);
                    }, 2000);
                }
            }
        });
    },
    GetCommandButton: function(format) {
        try {
            var o = document.createElement("button");
            o.id = `ytconv-${format}`;
            o.className = "yt-uix-tooltip";
            o.setAttribute("type", "button");
            o.innerHTML = `${format.toUpperCase()}<div class="yaydl-loading lds-ring yaydl-hidden"><div></div><div></div><div></div><div></div></div>`;
            o.addEventListener("click", function(o) {
                    YTDL.goToYTDL(o, format)
            });
            o.setAttribute("style", `min-height:25px; position:relative; cursor: pointer; font: 13px Arial; background: #FC0A0A; color: #fff; text-transform: uppercase; display: block; padding: 10px 16px; margin:7px 3.5px; border: 1px solid #FC0A0A; border-radius: 2px; font-weight:bold`);
            o.setAttribute("onmouseover", "this.style.backgroundColor='#FC0A0A'");
            o.setAttribute("onmouseout", "this.style.backgroundColor='#FC0A0A'");
            return o;
        } catch (o) {
            console.error("Error in function YTDL.GetCommandButton. ", o)
        }
    },
    getVid: function(o) {
        var t = o.location.toString().match(/^.*((m\.)?youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/);
        return !(!t || !t[3]) && t[3]
    }
};
YTDL.WaitLoadDom(window.document);