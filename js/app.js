function _ById(id) {
    return document.getElementById(id);
}
var xmlText = "";
//Gets url from input box and makes a GET request
function fetchUrl() {
    xmlText = "";
    var loading = _ById('loading');
    loading.style.display = 'block';
    var url = _ById('srcUrl').value;
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('text/html');
    xhr.onload = renderText;
    xhr.onerror = function() {
        loading.style.display = 'none';
        alert('Enter valid address, example: http://www.espncricinfo.com/')
        _ById('srcUrl').value = '';
    }

    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();


}

//Seralize html to text and display in a p tag
function renderText() {
    loading.style.display = 'none';
    if (this.status == 200) {
        xmlText = new XMLSerializer().serializeToString(this.responseXML);
        var xmlTextNode = document.createTextNode(xmlText);
        var pTag = _ById('htmlContent');
        pTag.innerHTML = '';
        pTag.appendChild(xmlTextNode);
        pTag.addEventListener('click', function(e) { clicked(e) });
    } else {
        alert('Enter valid address, example: http://www.yahoo.com')
        _ById('srcUrl').value = '';
    }
}

//logic to highlight the tags in entire page
function highlightTag(tag) {
    var pTag = _ById('htmlContent');
    var tokens = xmlText.split(tag);
    var node;
    var len = tokens.length - 1;
    pTag.innerHTML = '';

    for (var i = 0; i < len; i++) {
        node = document.createTextNode(tokens[i])
        pTag.appendChild(node);
        node = document.createElement('mark');
        node.appendChild(document.createTextNode(tag))
        pTag.appendChild(node);
    }
    node = document.createTextNode(tokens[i])
    pTag.appendChild(node);
}

//Handler for click event, finds the tag that was clicked
function clicked(e) {
    var errTag = _ById('err')
    errTag.style.visibility = 'hidden'
    err = false;
    s = window.getSelection()
    var range = s.getRangeAt(0)
    var node = s.anchorNode;
    while (range.toString().indexOf('<') != 0) {
        try {
            range.setStart(node, (range.startOffset - 1))
        } catch (e) {
            errTag.style.visibility = 'visible'
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            err = true;
            return false;
        }
    }
    do {
        try {
            range.setEnd(node, range.endOffset + 1)
        } catch (e) {
            errTag.style.visibility = 'visible'
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            err = true;
            return false;
        }
    } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '')
    var tag = range.toString().trim();

    tag = fixTag(tag)
    if (tag == '<') return false;
    highlightTag(tag)
}

//fix tag found by handler
function fixTag(tag) {
    var temp = '<';
    for (var i = 1; i < tag.length; ++i) {
        if (tag.charAt(i).match(/[a-z\-]/i)) {
            temp += tag.charAt(i);
        } else {
            break;
        }
    }
    return temp;

}