import { getPropByPath } from "../lib/propByPath"

export function htmlToPdfMake(html, dados) {
    if (!html)
        return [];
    html = html.replace(/<br\s*\/?>/gim, '\n');
    var i = html.indexOf('<');
    var paragraphs = [], paragraph, paragraphKind = 1, levels = [], p = 0;
    while (i >= 0) {
        if (i > p) {
            var antestag = html.substring(p, i);
            append(antestag);
        }
        var j = html.indexOf('>', i + 1);
        var tag = html.substring(i + 1, j);
        if (/^\//.test(tag)) close_tag(tag);
        else open_tag(tag);
        p = j + 1;
        i = html.indexOf('<', p);
    }
    if (p < html.length)
        append(html.substring(p));
    if (levels.length)
        throw new Error('Alguma tag não foi fechada');
    if (paragraphKind > 1)
        paragraphs.push(paragraph);
    return POG_text_array(paragraphs);
    function append(s) {
        if (typeof s === 'string' && s.indexOf('&nbsp;') !== -1) {
            while (s.indexOf('&nbsp;') !== -1) {
                s = s.replace('&nbsp;', ' ');
            }
        }
        if (paragraphKind === 1) {
            paragraph = s;
            paragraphKind = 2;
        }
        else if (paragraphKind === 2) {
            if (typeof paragraph === 'object') {
                if (Array.isArray(paragraph.text)) paragraph.text.push(s);
                else if (paragraph.text) paragraph = { text: [paragraph, s] };
                else paragraph.text = s;
            }
            else if (typeof s === 'object') {
                if (Array.isArray(s)) {
                    s.unshift(paragraph);
                    if (s.text)
                        paragraph = s;
                    else
                        paragraph = { text: s };
                }
                if (Array.isArray(s.text)) {
                    s.text.unshift(paragraph);
                    paragraph = s;
                }
                else if (s.text) paragraph = { text: [paragraph, s] };
                else if (s.text === '') paragraph = { text: [paragraph, s] };
                else s.text = paragraph;
            }
            else
                paragraph = {
                    text: [paragraph, s],
                };
            paragraphKind = 3;
        }
        else if (paragraphKind === 3) {
            paragraph.text.push(s);
        }
        else if (Array.isArray(paragraph))
            paragraph.push(s);
        else if (typeof paragraph === 'string')
            paragraph = [paragraph, s];
        else if (typeof paragraph === 'object') {
            if (Array.isArray(paragraph.text)) paragraph.text.push(s);
            else if (paragraph.text) paragraph = [paragraph, s];
            else paragraph.text = s;
        }
        else if (paragraph === undefined)
            paragraph = s;
        else
            throw new Error('paragraph error');
    }
    function POG_text_array(arr) {
        if (Array.isArray(arr) && arr.length === 1) {
            const tudo_eh_string = arr.every((p, idx) => {
                if (typeof p === 'string') return true;
                if (Array.isArray(p)) {
                    arr[idx] = POG_text_array(p);
                    return false;
                }
                if (typeof p === 'object') {
                    if (p.text && Array.isArray(p.text))
                        p.text = POG_text_array(p.text);
                    return false;
                }
                return false;
            });
            if (tudo_eh_string) return arr.join('');
        }
        return arr.map(function (p) {
            return p === undefined ? '\n' : p;
        });

        //if (typeof arr === 'object') POG_text_array(p);
    }
    function open_tag(tagtext) {
        var p = tagtext.trim().split(/\s+/g);
        var meta = htmlToPdfMakeTags[p[0].toLowerCase()];
        if (!meta)
            throw new Error(tagtext + ' não suportada');
        if (meta.paragraph && levels.length)
            throw new Error(tagtext + ' deve estar no primeiro nível');

        levels.push({
            tag: p[0],
            meta: meta,
            attrs: parseAttrs(meta, p, dados),
            upParagraph: paragraph,
            upKind: paragraphKind,
        });
        paragraph = undefined;
        paragraphKind = meta.paragraph ? 1 : 4;
    }
    function close_tag(tag) {
        if (!levels.length)
            throw new Error('Fechamento de tag inesperado ' + tag);
        var m = /^\/(\w+)/.exec(tag);
        var closing = levels.pop();
        if (m[1] !== closing.tag)
            throw new Error('Fechamento errado esperado = ' + closing.tag + ' tentando fechar ' + m[1]);
        var t = closing.meta.make(paragraph, closing.attrs, dados);
        paragraph = closing.upParagraph;
        paragraphKind = closing.upKind;
        append(t);
        if (closing.meta.paragraph) {
            paragraphs.push(paragraph);
            paragraph = undefined;
            paragraphKind = 1;
        }
    }
    function parseAttrs(meta, p) {
        if (p.length > 1 && !(meta.attrs || meta.attrs.length))
            throw new Error(p[0] + ' não aceita atributos');
        var r = { $count: 0 };
        for (var i = 1; i < p.length; i++) {
            var m = /^([^=]*)=(.*)$/.exec(p[i]);
            var key = /^"?([^"]*)"?$/.exec(m[1])[1];
            var value = /^"?([^"]*)"?$/.exec(m[2])[1];
            if (meta.attrs.indexOf(key) === -1)
                throw new Error(p[0] + ' não aceita o atributo ' + key);
            if (!(meta.clearAttrs && meta.clearAttrs.indexOf(key) === -1))
                r[key] = meta.convert[key](value);
            r.$count++;
        }
        return r;
    }
};

const htmlToPdfMakeTags = {
    'span': {
        clearAttrs: ['style'],
        make: function (content) {
            if (content.text) {
                return content;
            }
            else if (Array.isArray(content)) {
                return content.map((c) => {
                    if (typeof c === 'object') {
                        return c;
                    }
                    if (typeof c === 'string') {
                        return { text: c };
                    }
                    return c;
                });
            }
            return { text: content };
        },
    },
    'b': {
        make: function (content) {
            if (content.text) {
                content.bold = true;
                return content;
            }
            else if (Array.isArray(content)) {
                return content.map((c) => {
                    if (typeof c === 'object') {
                        c.bold = true;
                        return c;
                    }
                    if (typeof c === 'string') {
                        return { text: c, bold: true };
                    }
                    return c;
                });
            }
            return { bold: true, text: content };
        },
    },
    'strong': {
        make: function (content) {
            if (content.text) {
                content.bold = true;
                return content;
            }
            else if (Array.isArray(content)) {
                return content.map((c) => {
                    if (typeof c === 'object') {
                        c.bold = true;
                        return c;
                    }
                    if (typeof c === 'string') {
                        return { text: c, bold: true };
                    }
                    return c;
                });
            }
            return { bold: true, text: content };
        },
    },
    'i': {
        make: function (content) {
            if (content.text) {
                content.italics = true;
                return content;
            }
            else if (Array.isArray(content)) {
                return content.map((c) => {
                    if (typeof c === 'object') {
                        c.italics = true;
                        return c;
                    }
                    if (typeof c === 'string') {
                        return { text: c, italics: true };
                    }
                    return c;
                });
            }
            return { italics: true, text: content };
        },
    },
    'em': {
        make: function (content) {
            if (content.text) {
                content.italic = true;
                return content;
            }
            else if (Array.isArray(content)) {
                return content.map((c) => {
                    if (typeof c === 'object') {
                        c.italic = true;
                        return c;
                    }
                    if (typeof c === 'string') {
                        return { text: c, italic: true };
                    }
                    return c;
                });
            }
            return { italic: true, text: content };
        },
    },
    'u': {
        make: function (content) {
            if (content.text) {
                content.decoration = 'underline';
                return content;
            }
            else if (Array.isArray(content)) {
                return content.map((c) => {
                    if (typeof c === 'object') {
                        c.decoration = 'underline';
                        return c;
                    }
                    if (typeof c === 'string') {
                        return { text: c, decoration: 'underline' };
                    }
                    return c;
                });
            }
            return { decoration: 'underline', text: content };
        },
    },
    'p': {
        paragraph: true,
        attrs: ['align'],
        convert: {
            align(value) {
                value = value.toLowerCase();
                if (['left', 'right', 'center', 'justify'].indexOf(value) === -1)
                    throw new Error(value + ' não é um alinhameno válido');
                return value;
            },
        },
        make: function (content, attrs) {
            var r;
            if (attrs.$count === 0)
                return content;
            if (content.text)
                r = content;
            else
                r = { text: content };
            if (attrs.align)
                r.alignment = attrs.align;
            return r;
        },
    },
    'font': {
        paragraph: false,
        attrs: ['size'],
        convert: {
            size: function (value) {
                debugger
                value = parseInt(value) || 3;
                if (value === 1) return 8;
                if (value === 2) return 10;
                if (value === 3) return 12;
                if (value === 4) return 14;
                if (value === 5) return 18;
                if (value === 6) return 24;
                return 12;
            },
        },
        make: function (content, attr) {
            return { text: content, fontSize: attr.size };
        },
    },
    'ul': {

    },
    'li': {

    },
    'dinfield': {
        attrs: ['path', 'format', 'formatdate', 'constant'],
        convert: {
            path: function (value) {
                return value;
            },
            format: function (value) {
                return value;
            },
            formatdate: function (value) {
                return value;
            },
            constant: function (value) {
                return value;
            },
        },
        make: function (content, attrs, dados) {
            debugger
            var v = getPropByPath(dados, attrs.path) || '';
            return dinfield_format(v, attrs.format, attrs.formatdate, attrs.constant);
        },
    },
};

function dinfield_format(v, format, formatdate, constant) {
    // TODO
    // if (format) {
    //   v = h5format(v, format);
    // }
    // if (formatdate) {
    //   v = v.momentformat(formatdate);
    // }
    // if (constant) {
    //   v = constantes[constant][v];
    // }
    // if (v instanceof Date) {
    //   v = v.momentformat('ll');
    // }
    // if (typeof v !== 'string') {
    //   v = v.toString();
    // }
    return v;
}