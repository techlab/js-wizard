
export const applyTo = (value:any, cb:Function) => {
  const obj = Object(value);
  if (Symbol.iterator in obj) {
    value.forEach((v:Element) => {
      if (v) {
        cb(v)
      }
    });
  } else {
    if (value) {
      cb(value);
    }
  }
}

export const getElement = (selector:string) => {
  return document.querySelector(selector) as HTMLElement;
}

export const getElementById = (id:string) => {
  return document.getElementById(id);
}

export const getChildren = (selector:string, root:any = document) => {
  return root.querySelectorAll(selector);
}

export const findElement = (selector:string, root:any = document) => {
  return root.querySelector(selector);
}

export const findElements = (selector:string, root:any = document) => {
  return root.querySelectorAll(selector);
}

export const getFirstDescendant = (selector:string, root:any = document) => {
  // Check for first level element
  let elm = root.querySelector(selector);
  if (elm !== null) {
      return elm;
  }

  // Check for second level element
  root.querySelectorAll('*').forEach((element:Element) => {
    let tmp = element.querySelector(selector);
    if (tmp !== null) {
        elm = tmp;
        return false;
    }
  });

  if (elm !== null) {
      return elm;
  }
  return false;
}

export const addClass = (className:string, element:any) => {
  const cls = className.split(' ');
  applyTo(element, (el:any) => {
    if (el.classList) {
      el.classList.add(...cls);
    } else {
      el.className += (el.className ? ' ' : '') + className;
    }
  })
}

export const removeClass = (className:string, element:any) => {
  const cls = className.split(' ');
  applyTo(element, (el:any) => {
    if (el.classList) {
      el.classList.remove(...cls);
    } else {
      let clsNames = el.className;
      cls.forEach((c) => {
        clsNames = clsNames.replace(c, ' ');
      });
      el.className = clsNames;
    }
  })
}

export const removeClassByPrefix = (element:any, classNamePrefix:string) => {
  applyTo(element, (el:any) => {
    el.classList.forEach((className:string) => {
        if (className.startsWith(classNamePrefix)) {
          el.classList.remove(className);
        }
    })

    // var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    // el.className = el.className.replace(regx, '');
    
  })
}

export const hasClass = (className:string, element:any) => {
  if (element.classList)
        return element.classList.contains(className);
    return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

export const logMessage = (msg:string, type:string = 'error') => {
  if (type == 'error') {
    console.error(msg);
  } else if (type == 'warn') {
    console.warn(msg);
  } else if (type == 'info') {
    console.error(msg);
  } else {
    console.log(msg);
  }
}

export const hideElement = (element:any) => {
  applyTo(element, (el:any) => {
    el.style.display = "none"
  })
}

export const showElement = (element:any) => {
  applyTo(element, (el:any) => {
    el.style.display = "block"
  })
}

export const addEvent = (element:HTMLElement|any, event:keyof HTMLElementEventMap|keyof WindowEventMap, listener:any) => {
  applyTo(element, (el:HTMLElement) => {
    el.addEventListener(event, listener);
  })
}

export const triggerEvent = (el:HTMLElement, eventName:string, data = {}) => {
  return el.dispatchEvent(new CustomEvent(eventName, data));
}

export const getAttribute = (el:HTMLElement|any, attributeName:string) => {
  return el.getAttribute(attributeName);
}

export const setAttribute = (el:HTMLElement, attributeName:string, value:string) => {
  el.setAttribute(attributeName, value);
}

export const getElementWidth = (element:HTMLElement) => {
  return element.offsetWidth;
}

export const getElementHeight = (element:HTMLElement) => {
  return element.offsetHeight;
}

export const setElementWidth = (element:HTMLElement, val:string) => {
  element.style.width = val;
}

export const setElementHeight = (element:HTMLElement, val:any) => {
  element.style.height = val;
}

export const setHtml = (element: HTMLElement, content:string) => {
  element.innerHTML = content;
}

export const appendHTML = (element: HTMLElement, content: string):void => {
  element.innerHTML = element.innerHTML + content;
}

export const prependHTML = (element:HTMLElement, content:string) => {
  element.innerHTML = content + element.innerHTML ;
}

export const appendElement = (element:HTMLElement, content:HTMLElement) => {
  element.insertAdjacentElement('beforebegin', content);
}

export const prependElement = (element:HTMLElement, content:HTMLElement) => {
  element.insertAdjacentElement('afterend', content);
}