// 定义表情和图片的对应关系
const emojis = {
  '[微笑]': '100',
  '[撇嘴]': '101',
  '[色]': '102',
  '[发呆]': '103',
  '[得意]': '104',
  '[流泪]': '105',
  '[害羞]': '106',
  '[闭嘴]': '107',
  '[睡]': '108',
  '[大哭]': '109',
  '[尴尬]': '110',
  '[发怒]': '111',
  '[调皮]': '112',
  '[呲牙]': '113',
  '[惊讶]': '114',
  '[难过]': '115',
  '[酷]': '116',
  '[冷汗]': '117',
  '[抓狂]': '118',
  '[吐]': '119',
}

// 将表情文字转为图片
const emojiToPath = (i) => `/images/emojis/${emojis[i]}.gif`

// 将聊天内容转为一个文字和图片混合的列表
const textToEmoji = (s) => {
  const r = /\[[^\[\]]+?\]/g;

  const a = [];
  let t = null;
  let i = 0;

  while (true) {
    t = r.exec(s);
    if (t) {
      a.push({
        msgType: 'text',
        msgCont: s.slice(i, t.index)
      });

      if (emojis[t[0]]) {
        a.push({
          msgType: 'emoji',
          msgCont: t[0],
          msgImage: emojiToPath(t[0])
        });
      } else {
        a.push({
          msgType: 'text',
          msgCont: t[0]
        });
      }

      i = t.index + t[0].length;
    } else {
      a.push({
        msgType: 'text',
        msgCont: s.slice(i)
      });
      break;
    }
  }

  return a;
}

module.exports = {
  emojis,
  emojiToPath,
  textToEmoji,
}

