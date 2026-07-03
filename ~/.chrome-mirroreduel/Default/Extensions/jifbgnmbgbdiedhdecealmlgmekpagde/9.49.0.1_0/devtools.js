try{var A,e,t,r,n="u">typeof window?window:"u">typeof global?global:"u">typeof globalThis?globalThis:"u">typeof self?self:{},a=(new n.Error).stack;a&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[a]="3b833298-21bb-4e23-9a03-bf7995c19c51",n._sentryDebugIdIdentifier="sentry-dbid-3b833298-21bb-4e23-9a03-bf7995c19c51")}catch(A){}var o="u">typeof window?window:"u">typeof global?global:"u">typeof globalThis?globalThis:"u">typeof self?self:{};o.SENTRY_RELEASE={id:"f81fc1d4c0d239b8bd45d73d26a0d91a00e5b22e"},o.SENTRY_BUILD_INFO={deps:["@babel/core","@babel/plugin-proposal-decorators","@babel/plugin-syntax-decorators","@babel/plugin-transform-runtime","@babel/preset-env","@babel/preset-react","@babel/preset-typescript","@blacklist-ai/blacklist-ai","@braintree/sanitize-url","@cards-manager-client/cards-manager-client","@chromatic-com/storybook","@floating-ui/react","@mcp-hub-client/mcp-hub-client","@modelcontextprotocol/sdk","@playwright/test","@redux-devtools/cli","@redux-devtools/core","@redux-devtools/remote","@redux-devtools/utils","@reduxjs/toolkit","@rspack/cli","@rspack/core","@rspack/plugin-node-polyfill","@sentry/browser","@sentry/webpack-plugin","@storybook/addon-essentials","@storybook/addon-interactions","@storybook/addon-links","@storybook/addon-onboarding","@storybook/addon-styling-webpack","@storybook/addon-webpack5-compiler-babel","@storybook/addon-webpack5-compiler-swc","@storybook/blocks","@storybook/components","@storybook/manager-api","@storybook/preview-api","@storybook/react","@storybook/react-webpack5","@storybook/test","@storybook/theming","@storybook/types","@tailwindcss/container-queries","@testing-library/dom","@testing-library/jest-dom","@testing-library/react","@testing-library/user-event","@types/archiver","@types/chrome","@types/crypto-js","@types/diff","@types/dotenv-webpack","@types/inquirer","@types/lodash-es","@types/node","@types/node-fetch","@types/react","@types/react-dom","@types/react-window","@types/redux-logger","@types/unist","@types/uuid","@types/webpack","@types/webpack-bundle-analyzer","@types/webpack-dev-server","@types/ws","@types/zip-webpack-plugin","@typescript-eslint/eslint-plugin","@typescript-eslint/parser","@uidotdev/usehooks","@vitejs/plugin-react","@vitest/coverage-v8","@vitest/ui","archiver","autoprefixer","axios","babel-loader","base64-arraybuffer","bezier-easing","classnames","clean-webpack-plugin","copy-webpack-plugin","cross-env","crypto-js","css-loader","css-minimizer-webpack-plugin","date-fns","dedent","dexie","dexie-react-hooks","diff","dotenv","dotenv-webpack","effect","eslint","eslint-config-prettier","eslint-plugin-filenames-simple","eslint-plugin-jsx-a11y","eslint-plugin-notice","eslint-plugin-prettier","eslint-plugin-react","eslint-plugin-react-hooks","eslint-plugin-storybook","eslint-webpack-plugin","fake-indexeddb","file-type","firebase","fork-ts-checker-webpack-plugin","form-data","html-to-image","html-webpack-plugin","husky","i18next","i18next-browser-languagedetector","i18next-parser","immer","inquirer","jsdom","katex","lint-staged","lodash-es","lowlight","madge","marked","mdast-builder","memoize-one","motion","node-fetch","node-polyfill-webpack-plugin","postcss","postcss-import","postcss-loader","prettier","prettier-plugin-sort-json","prettier-plugin-tailwindcss","react","react-devtools","react-dom","react-i18next","react-markdown","react-redux","react-router-dom","react-tiny-popover","react-use-event-hook","react-virtualized-auto-sizer","react-window","redux","redux-logger","redux-persist","redux-saga","rehype-external-links","rehype-highlight","rehype-katex","remark-gfm","remark-math","reselect","sse.js","storybook","storybook-addon-data-theme-switcher","style-loader","tailwindcss","tailwindcss-animated","terser-webpack-plugin","ts-checker-rspack-plugin","ts-node","tsx","typed-redux-saga","typesafe-actions","typescript","unist-util-visit","usehooks-ts","uuid","vite","vite-tsconfig-paths","vitest","wait-on","webext-redux","webpack","webpack-bundle-analyzer","webpack-cli","webpack-dev-server","webpack-merge","ws","zip-webpack-plugin"],depsVersions:{react:19,vite:6,webpack:5},nodeVersion:22};var i={58486(A,e,t){t.d(e,{FE:()=>a.FE,O_:()=>n.O_,Ug:()=>o.U,f1:()=>d,fX:()=>h,hF:()=>p,lL:()=>c,mI:()=>i.mI,t4:()=>n.t4,vj:()=>g,xM:()=>B,xW:()=>s}),t(54756);var r=t(57693);t(9401);var n=t(65580),a=t(91041);t(64998);var o=t(16179),i=t(17375),s=function(){for(var A=arguments.length,e=Array(A),t=0;t<A;t++)e[t]=arguments[t];return e.filter(function(A){return"string"==typeof A&&""!==A}).join(" ")},l=0,d=function(){return new Date().getTime().toString()+Math.floor(100*Math.random()).toString()+(++l).toString()},c=function(){var A=new Date;return"conversation-".concat(A.getTime())},m=function(A){return String(A).padStart(2,"0")},p=function(){var A=-new Date().getTimezoneOffset(),e=Math.abs(A);return 0===A?"Z":[A>0?"+":"-",m(Math.floor(e/60)),":",m(e%60)].join("")};function B(A,e){return new Promise(function(t,r){setTimeout(function(){r(Error(e||"Operation timeout after ".concat(A,"ms")))},A)})}function g(A){return Object.entries(A)}var h=function(A){return"".concat(r.j9,"?q=").concat(encodeURIComponent(A))}},7984(A,e,t){t.d(e,{$n:()=>r.$n,Bm:()=>d,ks:()=>s});var r=t(66610),n=t(96540),a=t(58486),o=t(61394),i=t(74848),s=(0,n.forwardRef)(function(A,e){var t=A.className,r=A.onFocus,n=A.onChange,s=A.onKeyDown,l=A.onKeyUp,d=A.value,c=A.maxLength,m=A.placeholder,p=A.defaultValue,B=(0,o.sh)({element:"outline-none px-2 py-1 min-w-10",background:"bg-color-neutral-90",text:"text-color-text-01 text-body-m",rounded:"rounded-aria-radius-3",operaGx:{background:"bg-color-level-0"},operaAir:{rounded:"rounded-full",background:"bg-color-neutral-90"}},["element","background","text","rounded"]);return(0,i.jsx)("input",{ref:e,className:(0,a.xW)(B.element,B.background,B.text,B.rounded,t),type:"text",maxLength:c,value:d,onFocus:r,onChange:n,onKeyDown:s,onKeyUp:l,placeholder:m,defaultValue:p})}),l=t(44125),d=function(A){var e=A.children,t=A.onClick,r=A.isOpened,n=A.headingLabel,s=A.headingLabelSlot,d=A.scrollViewContent,c=(0,o.sh)({headingLabel:"text-color-text-03",operaGx:{headingLabel:"text-color-text-01"}},["headingLabel"]);return(0,i.jsxs)("div",{children:[(0,i.jsx)("button",{type:"button",tabIndex:-1,className:"text-header-s flex w-full cursor-pointer flex-row items-center gap-1 p-aria-4 outline-none","data-testid":l.Y.COLLAPSIBLE_LINKS_TOGGLE,onClick:function(){return t(!r)},children:(0,i.jsxs)("div",{className:"flex-1",children:[n&&(0,i.jsx)("p",{className:(0,a.xW)("text-header-s text-left",c.headingLabel),children:n}),s]})}),(0,i.jsx)("div",{className:(0,a.xW)("w-full px-aria-4",r?"block":"hidden",void 0!==d&&d?"pb-aria-3":"pb-aria-4"),"data-testid":l.Y.COLLAPSIBLE_LINKS_SECTION,children:e})]})};t(67460)},15478(A,e,t){t(61394),t(58486),t(96540),t(74848)},69424(A,e,t){var r=t(85072),n=t.n(r),a=t(97825),o=t.n(a),i=t(77659),s=t.n(i),l=t(44868),d=t.n(l),c=t(10540),m=t.n(c),p=t(41113),B=t.n(p),g=t(29224),h={attributes:{source:"aria-extension"}};h.styleTagTransform=B(),h.setAttributes=d(),h.insert=s().bind(null,"head"),h.domAPI=o(),h.insertStyleElement=m(),n()(g.A,h),g.A&&g.A.locals&&g.A.locals;var x=t(5338),u=t(49932),b=t(3453),f=t(96540),w=t(89394),E=t(10467),v=t(54756),y=t.n(v),k=t(7984),C=t(64467),j=t(74848),I=(0,f.createContext)(void 0),N=function(A){var e=A.children,t=A.initialTabId,r=(0,f.useState)(void 0===t?0:t),n=(0,b.A)(r,2),a=n[0],o=n[1],i=(0,f.useState)(null),s=(0,b.A)(i,2),l=s[0],d=s[1],c=(0,f.useState)(null),m=(0,b.A)(c,2),p=m[0],B=m[1];return(0,j.jsx)(I.Provider,{value:{tabId:a,setTabId:o,groupId:l,setGroupId:d,windowId:p,setWindowId:B},children:e})},S=function(){var A=(0,f.useContext)(I);if(void 0===A)throw Error("useTabId must be used within a TabIdProvider");return A};function z(A,e){return D.apply(this,arguments)}function D(){return(D=(0,E.A)(y().mark(function A(e,t){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,chrome.scripting.executeScript({target:{tabId:e},func:function(A){var e=A.x,t=A.y,r=document.createElement("div");r.style.position="fixed",r.style.left=e+"px",r.style.top=t+"px",r.style.width="10px",r.style.height="10px",r.style.border="3px solid #5021ff",r.style.borderRadius="50%",r.style.zIndex="999999",r.style.pointerEvents="none",r.style.transform="translate(-50%, -50%)",r.style.transition="all 0.8s ease-out",r.style.opacity="1",document.body.appendChild(r),setTimeout(function(){r.style.width="60px",r.style.height="60px",r.style.opacity="0"},50),setTimeout(function(){r.parentNode&&r.parentNode.removeChild(r)},800)},args:[t]});case 1:case"end":return A.stop()}},A)}))).apply(this,arguments)}var O=t(15763);let T=t.p+"assets/059e8a27e58989ac.svg";var P=t(51550);function M(A,e){var t=Object.keys(A);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(A);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(A,e).enumerable})),t.push.apply(t,r)}return t}function _(A){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?M(Object(t),!0).forEach(function(e){(0,C.A)(A,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(A,Object.getOwnPropertyDescriptors(t)):M(Object(t)).forEach(function(e){Object.defineProperty(A,e,Object.getOwnPropertyDescriptor(t,e))})}return A}var U=function(A){var e,t=A.node,r=A.children,n=A.isExpanded,a=A.isParentMissing,o=(0,f.useState)(n),i=(0,b.A)(o,2),s=i[0],l=i[1],d=S().tabId,c=(e=(0,E.A)(y().mark(function A(e){var t,r,n,a,o,i;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return t=e.x,r=e.y,n=e.width,a=e.height,o=Math.round(t+n/2),i=Math.round(r+a/2),console.log("Clicking at coordinates: (".concat(o,", ").concat(i,")")),A.next=1,z(d,{x:o,y:i});case 1:return A.next=2,(0,P.VI)(d,o,i);case 2:case"end":return A.stop()}},A)})),function(A){return e.apply(this,arguments)});return(0,j.jsxs)("div",{children:[(0,j.jsxs)("div",{className:"flex gap-1",children:[(0,j.jsxs)("span",{onClick:function(){l(!s)},children:[s?"▼":"▶"," NodeID: ",t.id," | ",t.htmlTag,t.value&&(0,j.jsxs)("strong",{children:[" VALUE: ",t.value]}),"selected"in t&&(0,j.jsx)("strong",{children:" SELECTED"})]}),a&&(0,j.jsx)(O.m,{title:"Parent node is missing",children:function(A){var e=A.ref,t=A.referenceProps;return(0,j.jsx)("span",_(_({className:"flex",ref:e},t),{},{children:(0,j.jsx)("img",{src:T,alt:"",draggable:"false"})}))}})]}),s&&(0,j.jsxs)("div",{className:"flex flex-col",children:[(0,j.jsx)("ul",{className:"ml-6",children:Object.keys(t).filter(function(A){return"id"!==A}).map(function(A,e){var r=t[A],n="boundingBox"===A?"[".concat(r.x,",").concat(r.y,"] [").concat(r.x+r.width,",").concat(r.y+r.height,"]"):r;return(0,j.jsxs)("li",{children:[(0,j.jsx)("strong",{children:A.replace(/([A-Z])/g," $1").trim()}),": ",n]},e+A)})}),(0,j.jsxs)("div",{className:"flex justify-center gap-2 overflow-auto pt-1",children:[(0,j.jsx)(k.$n,{size:"xs",type:"primary",onClick:function(){return(0,P.K9)(t.id,d)},children:"Focus Node"}),(0,j.jsx)(k.$n,{size:"xs",type:"primary",onClick:function(){return(0,P.i5)(t.id,d)},children:"Highlight"}),(0,j.jsx)(k.$n,{size:"xs",type:"secondary",onClick:function(){return(0,P.DX)(d)},children:"Stop Highlight"}),(0,j.jsx)(k.$n,{size:"xs",type:"secondary",disabled:!t.boundingBox,onClick:function(){return(null==t?void 0:t.boundingBox)&&c(t.boundingBox)},children:"Click Coords"}),(0,j.jsx)(k.$n,{size:"xs",type:"secondary",onClick:function(){return(0,P.iK)(t.id,d)},disabled:!t.id,children:"Default Action"})]})]}),r&&s&&(0,j.jsxs)("div",{children:[(0,j.jsx)("h5",{children:"Children:"}),(0,j.jsx)("ul",{children:r.map(function(A,e){return(0,j.jsx)("li",{children:(0,j.jsx)(U,{node:A.node})},e)})})]})]})},$=(0,f.memo)(U);let L=(0,f.memo)(function(A){var e=A.data,t=A.missingParentsIds,r=(0,f.useState)(""),n=(0,b.A)(r,2),a=n[0],o=n[1],i=(0,f.useMemo)(function(){return e.sort(function(A,e){return A.id-e.id})},[e]),s=(0,f.useState)(!0),l=(0,b.A)(s,2),d=l[0],c=l[1],m=i.filter(function(A){var e,t,r,n;return(null==(e=A.value)?void 0:e.toString().includes(a))||A.id.toString().includes(a)||(null==(t=A.name)?void 0:t.toString().includes(a))||(null==(r=A.htmlTag)?void 0:r.toString().includes(a))||(null==(n=A.textContent)?void 0:n.toString().includes(a))||""===a}),p=i.filter(function(A){return!!A.value||!!A.selected});return(0,j.jsxs)("div",{children:[(0,j.jsxs)("div",{className:"text-header-s",children:["Nodes with value count: ",p.length]}),p.map(function(A,e){return(0,j.jsx)(U,{node:A,isParentMissing:!!A.parentId&&(null==t?void 0:t.includes(A.parentId))},e+A.id)}),(0,j.jsx)(k.Bm,{isOpened:d,onClick:function(){return c(function(A){return!A})},headingLabel:"Nodes Count: "+m.length,children:(0,j.jsxs)("div",{className:"h-96 overflow-y-scroll",children:[(0,j.jsx)(k.ks,{placeholder:"Search",value:a,onChange:function(A){return o(A.target.value)}}),m.map(function(A,e){return(0,j.jsx)($,{node:A,nextNode:m[e+1],isParentMissing:!!A.parentId&&(null==t?void 0:t.includes(A.parentId))},e+A.id)})]})})]})});var F=t(80045),Y=["childIds","nodes","depth"];function R(A,e){var t=Object.keys(A);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(A);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(A,e).enumerable})),t.push.apply(t,r)}return t}function q(A){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?R(Object(t),!0).forEach(function(e){(0,C.A)(A,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(A,Object.getOwnPropertyDescriptors(t)):R(Object(t)).forEach(function(e){Object.defineProperty(A,e,Object.getOwnPropertyDescriptor(t,e))})}return A}var H=function(A){var e=A.childIds,t=A.nodes,r=A.depth,n=(0,F.A)(A,Y),a=(0,f.useState)(r<6),o=(0,b.A)(a,2),i=o[0],s=o[1],l=(0,f.useState)(!1),d=(0,b.A)(l,2),c=d[0],m=d[1],p=function(){m(!c)};return(0,j.jsxs)("div",{className:"flex flex-col",children:[(0,j.jsxs)("div",{className:"flex cursor-pointer items-center justify-between py-2 pl-4 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800",onClick:function(){s(!i)},children:[(0,j.jsxs)("div",{className:"flex items-center",children:[e&&e.length>0&&(0,j.jsx)("span",{className:"mr-1 text-gray-500",children:i?"▼":"▶"}),(0,j.jsxs)("span",{className:"text-xs font-medium",children:[n.role," - ",n.name]})]}),Object.keys(n).length>0&&(0,j.jsxs)("button",{className:"ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-400",onClick:function(A){A.stopPropagation(),p()},children:[c?"Hide":"Show"," details"]})]}),c&&(0,j.jsx)("div",{className:"pl-4",children:(0,j.jsx)($,{node:n,isExpanded:!0})}),i&&e&&e.length>0&&(0,j.jsx)("ul",{className:"pl-4",children:e.map(function(A){return(0,j.jsx)(H,q(q({},null==t?void 0:t.find(function(e){return e.id===A})),{},{nodes:t,depth:r+1}),A)})})]})};let X=(0,f.memo)(function(A){var e=A.nodes;return(0,j.jsx)("div",{className:"flex flex-col overflow-hidden",children:(0,j.jsx)(H,q(q({},e[0]),{},{nodes:e,depth:0}))})});var G=function(A){var e,t=(0,f.useState)(!1),r=(0,b.A)(t,2),n=r[0],a=r[1],o=(0,f.useState)(0),i=(0,b.A)(o,2),s=i[0],l=i[1],d=(e=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:l(function(A){return A+1});case 1:case"end":return A.stop()}},A)})),function(){return e.apply(this,arguments)}),c=function(){l(0)};return(0,f.useEffect)(function(){return A&&n&&(console.log("### Adding listener ###"),opr.browserOperatorPrivate.onTreeChanged.addListener(d)),function(){opr.browserOperatorPrivate.onTreeChanged.removeListener(d),c()}},[A,n]),{isListening:n,toggleListener:function(){a(function(A){return!A})},count:s,resetCounter:c}},K=t(92132),W=t(58486),V=t(61394),Z=(0,f.forwardRef)(function(A,e){var t=A.className,r=A.onFocus,n=A.onChange,a=A.onKeyDown,o=A.onKeyUp,i=A.value,s=A.maxLength,l=A.placeholder,d=A.defaultValue,c=A.type,m=(0,V.sh)({element:"outline-none px-2 py-1 min-w-10",background:"bg-color-neutral-90",text:"text-color-text-01 text-body-m",rounded:"rounded-aria-radius-3",operaGx:{background:"bg-color-level-0"},operaAir:{rounded:"rounded-full",background:"bg-color-level-2"}},["element","background","text","rounded"]);return(0,j.jsx)("input",{ref:e,className:(0,W.xW)(m.element,m.background,m.text,m.rounded,t),type:c||"text",maxLength:s,value:i,onFocus:r,onChange:n,onKeyDown:a,onKeyUp:o,placeholder:l,defaultValue:d})}),Q=t(69031),J=t(31935),AA=t(36348);function Ae(A,e){var t=Object.keys(A);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(A);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(A,e).enumerable})),t.push.apply(t,r)}return t}function At(A){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?Ae(Object(t),!0).forEach(function(e){(0,C.A)(A,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(A,Object.getOwnPropertyDescriptors(t)):Ae(Object(t)).forEach(function(e){Object.defineProperty(A,e,Object.getOwnPropertyDescriptor(t,e))})}return A}let Ar=function(A){var e,t,r=A.tabId,n=(0,f.useState)(null),a=(0,b.A)(n,2),o=a[0],i=a[1],s=(0,f.useState)(null),l=(0,b.A)(s,2),d=l[0],c=l[1],m=(0,f.useState)(!0),p=(0,b.A)(m,2),B=p[0],g=p[1],h=(0,f.useState)(null),x=(0,b.A)(h,2),u=x[0],w=x[1],v=(0,f.useState)(null),k=(0,b.A)(v,2),C=k[0],I=k[1],N=(0,f.useState)(!1),S=(0,b.A)(N,2),z=S[0],D=S[1],O=(e=(0,E.A)(y().mark(function A(e){var t;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,chrome.tabs.get(e);case 1:c({id:(t=A.sent).id,title:t.title,url:t.url,favIconUrl:t.favIconUrl}),A.next=3;break;case 2:A.prev=2,console.log("Could not fetch opener tab info:",A.catch(0)),c(null);case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(A){return e.apply(this,arguments)}),T=(0,f.useCallback)((t=(0,E.A)(y().mark(function A(e){var t,r;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,chrome.tabs.get(e);case 1:if(i(t=A.sent),D(t.active),I(new Date),w(null),!t.openerTabId){A.next=3;break}return A.next=2,O(t.openerTabId);case 2:A.next=4;break;case 3:c(null);case 4:A.next=6;break;case 5:A.prev=5,r=A.catch(0),w("Error fetching tab data: ".concat(r)),i(null),c(null),D(!1);case 6:return A.prev=6,g(!1),A.finish(6);case 7:case"end":return A.stop()}},A,null,[[0,5,6,7]])})),function(A){return t.apply(this,arguments)}),[]);return((0,f.useEffect)(function(){T(r);var A=function(A,e,t){A===r&&(i(t),D(t.active),I(new Date),console.log("Tab updated:",e),t.openerTabId&&t.openerTabId!==(null==o?void 0:o.openerTabId)?O(t.openerTabId):t.openerTabId||c(null)),null!=o&&o.openerTabId&&A===o.openerTabId&&O(o.openerTabId)},e=function(A){A.tabId===r?(D(!0),T(r)):z&&(D(!1),i(function(A){return A?At(At({},A),{},{active:!1}):null}),I(new Date))},t=function(A){A===r?(w("Tab has been closed"),i(null),c(null),D(!1)):null!=o&&o.openerTabId&&A===o.openerTabId&&c(null)};return chrome.tabs.onUpdated.addListener(A),chrome.tabs.onActivated.addListener(e),chrome.tabs.onRemoved.addListener(t),function(){chrome.tabs.onUpdated.removeListener(A),chrome.tabs.onActivated.removeListener(e),chrome.tabs.onRemoved.removeListener(t)}},[r,z,null==o?void 0:o.openerTabId,T]),B)?(0,j.jsxs)("div",{className:"flex items-center justify-center p-6",children:[(0,j.jsx)("div",{className:"h-8 w-8 animate-spin rounded-full border-b-2 border-blue-400 dark:border-blue-300"}),(0,j.jsx)("span",{className:"ml-2 text-gray-600 dark:text-gray-300",children:"Loading tab data..."})]}):u?(0,j.jsxs)("div",{className:"rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20",children:[(0,j.jsx)("div",{className:"flex items-center",children:(0,j.jsx)("div",{className:"text-sm font-medium text-red-500 dark:text-red-400",children:"Error"})}),(0,j.jsx)("div",{className:"mt-1 text-sm text-red-700 dark:text-red-300",children:u})]}):o?(0,j.jsxs)("div",{className:"mx-auto max-w-4xl rounded-lg border bg-color-level-1-1 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900",children:[(0,j.jsxs)("div",{className:"mb-6 flex items-center justify-between",children:[(0,j.jsxs)("h2",{className:"text-2xl font-bold text-color-text-03",children:["Tab Monitor #",r,(0,j.jsx)("span",{className:"ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs ".concat(z?"bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100":"bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"),children:z?"● ACTIVE":"○ INACTIVE"})]}),C&&(0,j.jsxs)("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:["Last updated: ",C.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})]})]}),(0,j.jsxs)("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:[(0,j.jsxs)("div",{className:"rounded-lg border bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-900/20",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-blue-800 dark:text-blue-300",children:"Basic Info"}),(0,j.jsxs)("div",{className:"space-y-1 text-sm text-gray-700 dark:text-gray-300",children:[(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"ID:"})," ",o.id]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Index:"})," ",o.index]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Window ID:"})," ",o.windowId]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Group ID:"}),(0,j.jsx)("span",{className:"ml-1 ".concat(void 0!==o.groupId&&-1!==o.groupId?"text-blue-600 dark:text-blue-400":"text-gray-500 dark:text-gray-400"),children:void 0!==o.groupId&&-1!==o.groupId?o.groupId:"None"})]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Opener Tab ID:"}),(0,j.jsx)("span",{className:"ml-1 ".concat(o.openerTabId?"text-blue-600 dark:text-blue-400":"text-gray-500 dark:text-gray-400"),children:o.openerTabId||"None"})]})]})]}),o.openerTabId&&(0,j.jsxs)("div",{className:"rounded-lg border bg-cyan-50 p-4 dark:border-cyan-800/30 dark:bg-cyan-900/20",children:[(0,j.jsxs)("h3",{className:"mb-2 font-semibold text-cyan-800 dark:text-cyan-300",children:["Opener Tab Info",(0,j.jsxs)("span",{className:"ml-1 text-xs text-cyan-600 dark:text-cyan-400",children:["(#",o.openerTabId,")"]})]}),(0,j.jsx)("div",{className:"space-y-1 text-sm text-gray-700 dark:text-gray-300",children:d?(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Tab ID:"})," ",d.id]}),d.title&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Title:"}),(0,j.jsx)("div",{className:"mt-1 truncate rounded bg-white p-1 text-xs dark:bg-gray-800",children:d.title})]}),d.url&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"URL:"}),(0,j.jsx)("div",{className:"mt-1 break-all rounded bg-white p-1 text-xs dark:bg-gray-800",children:d.url})]}),d.favIconUrl&&(0,j.jsxs)("div",{className:"flex items-center",children:[(0,j.jsx)("span",{className:"mr-2 font-medium",children:"Favicon:"}),(0,j.jsx)("img",{src:d.favIconUrl,alt:"Opener Favicon",className:"h-4 w-4"})]})]}):(0,j.jsx)("div",{className:"text-xs text-gray-500 dark:text-gray-400",children:"Opener tab not accessible or closed"})})]}),(0,j.jsxs)("div",{className:"rounded-lg border bg-green-50 p-4 dark:border-green-800/30 dark:bg-green-900/20",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-green-800 dark:text-green-300",children:"Status"}),(0,j.jsxs)("div",{className:"space-y-1 text-sm text-gray-700 dark:text-gray-300",children:[(0,j.jsxs)("div",{className:"flex items-center",children:[(0,j.jsx)("span",{className:"mr-2 font-medium",children:"Active:"}),(0,j.jsx)("span",{className:"rounded-full px-2 py-1 text-xs font-medium ".concat(z?"bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100":"bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"),children:z?"YES":"NO"})]}),(0,j.jsxs)("div",{className:"flex items-center",children:[(0,j.jsx)("span",{className:"mr-2 font-medium",children:"Pinned:"}),(0,j.jsx)("span",{className:"rounded-full px-2 py-1 text-xs ".concat(o.pinned?"bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100":"bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"),children:o.pinned?"YES":"NO"})]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Loading Status:"})," ",o.status||"N/A"]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Incognito:"})," ",o.incognito?"YES":"NO"]})]})]}),(0,j.jsxs)("div",{className:"rounded-lg border bg-yellow-50 p-4 dark:border-yellow-800/30 dark:bg-yellow-900/20",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-yellow-800 dark:text-yellow-300",children:"Audio"}),(0,j.jsxs)("div",{className:"space-y-1 text-sm text-gray-700 dark:text-gray-300",children:[(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Audible:"})," ",o.audible?"YES":"NO"]}),o.mutedInfo&&(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Muted:"})," ",o.mutedInfo.muted?"YES":"NO"]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Mute Reason:"})," ",o.mutedInfo.reason||"N/A"]})]})]})]}),(0,j.jsxs)("div",{className:"rounded-lg border bg-purple-50 p-4 md:col-span-2 lg:col-span-3 dark:border-purple-800/30 dark:bg-purple-900/20",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-purple-800 dark:text-purple-300",children:"Page Details"}),(0,j.jsxs)("div",{className:"space-y-2 text-sm text-gray-700 dark:text-gray-300",children:[o.title&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Title:"}),(0,j.jsx)("div",{className:"mt-1 break-all rounded border bg-white p-2 dark:border-gray-700 dark:bg-gray-800",children:o.title})]}),o.url&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"URL:"}),(0,j.jsx)("div",{className:"mt-1 break-all rounded border bg-white p-2 dark:border-gray-700 dark:bg-gray-800",children:o.url})]}),o.pendingUrl&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Pending URL:"}),(0,j.jsx)("div",{className:"mt-1 break-all rounded border bg-white p-2 dark:border-gray-700 dark:bg-gray-800",children:o.pendingUrl})]}),o.favIconUrl&&(0,j.jsxs)("div",{className:"flex items-center",children:[(0,j.jsx)("span",{className:"mr-2 font-medium",children:"Favicon:"}),(0,j.jsx)("img",{src:o.favIconUrl,alt:"Favicon",className:"mr-2 h-4 w-4"}),(0,j.jsx)("span",{className:"break-all text-xs text-gray-600 dark:text-gray-400",children:o.favIconUrl})]})]})]}),(0,j.jsxs)("div",{className:"rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-gray-800 dark:text-gray-200",children:"Additional"}),(0,j.jsxs)("div",{className:"space-y-1 text-sm text-gray-700 dark:text-gray-300",children:[(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Highlighted:"})," ",o.highlighted?"YES":"NO"]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Discarded:"})," ",o.discarded?"YES":"NO"]}),(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Auto Discardable:"})," ",o.autoDiscardable?"YES":"NO"]})]})]}),(o.width||o.height)&&(0,j.jsxs)("div",{className:"rounded-lg border bg-indigo-50 p-4 dark:border-indigo-800/30 dark:bg-indigo-900/20",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-indigo-800 dark:text-indigo-300",children:"Dimensions"}),(0,j.jsxs)("div",{className:"space-y-1 text-sm text-gray-700 dark:text-gray-300",children:[o.width&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Width:"})," ",o.width,"px"]}),o.height&&(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Height:"})," ",o.height,"px"]})]})]}),o.sessionId&&(0,j.jsxs)("div",{className:"rounded-lg border bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/20",children:[(0,j.jsx)("h3",{className:"mb-2 font-semibold text-red-800 dark:text-red-300",children:"Session"}),(0,j.jsx)("div",{className:"text-sm text-gray-700 dark:text-gray-300",children:(0,j.jsxs)("div",{children:[(0,j.jsx)("span",{className:"font-medium",children:"Session ID:"})," ",o.sessionId]})})]})]})]}):(0,j.jsx)("div",{className:"rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800",children:(0,j.jsx)("div",{className:"text-sm text-gray-600 dark:text-gray-300",children:"No tab data available"})})};var An=t(32663);let Aa=function(A){var e=A.tabId,t=(0,f.useState)("<h1>Hello</h1>"),r=(0,b.A)(t,2),n=r[0],a=r[1],o=(0,f.useState)(!1),i=(0,b.A)(o,2),s=i[0],l=i[1],d=(0,f.useState)(null),c=(0,b.A)(d,2),m=c[0],p=c[1],B=(0,f.useCallback)((0,E.A)(y().mark(function A(){var t,r;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return l(!0),p(null),A.prev=1,A.next=2,(0,An.MS)(e,n);case 2:p("Success: HTML injected into Google Docs"),A.next=4;break;case 3:A.prev=3,t=(r=A.catch(1))instanceof Error?r.message:String(r),p("Error: ".concat(t)),console.error("Failed to inject HTML:",r);case 4:return A.prev=4,l(!1),A.finish(4);case 5:case"end":return A.stop()}},A,null,[[1,3,4,5]])})),[e,n]);return(0,j.jsxs)("div",{className:"flex flex-col gap-4 p-4",children:[(0,j.jsx)("h3",{className:"text-header-l",children:"Google Docs HTML Injector"}),(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)("label",{className:"text-header-m",children:"HTML Content:"}),(0,j.jsx)("textarea",{className:"ext-color-text-01 min-h-[200px] rounded border border-gray-300 bg-color-neutral-92-60 p-2 font-mono text-sm",value:n,onChange:function(A){return a(A.target.value)},placeholder:"Enter HTML content to inject...",spellCheck:!1})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)("label",{className:"text-header-s",children:"Preset Examples:"}),(0,j.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>\n<h4>Heading 4</h4>\n<h5>Heading 5</h5>\n<h6>Heading 6</h6>\n\n<p>This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, <u>underlined text</u>, and <code>inline code</code>.</p>\n\n<blockquote>This is a blockquote. It can contain multiple paragraphs and other elements.</blockquote>\n\n<ul>\n  <li>Unordered list item 1</li>\n  <li>Unordered list item 2</li>\n  <li>Unordered list item 3</li>\n</ul>\n\n<ol>\n  <li>Ordered list item 1</li>\n  <li>Ordered list item 2</li>\n  <li>Ordered list item 3</li>\n</ol>\n\n<pre>Preformatted text\n  with preserved    spacing\n    and line breaks</pre>\n\n<table>\n  <tr>\n    <th>Header 1</th>\n    <th>Header 2</th>\n    <th>Header 3</th>\n  </tr>\n  <tr>\n    <td>Cell 1</td>\n    <td>Cell 2</td>\n    <td>Cell 3</td>\n  </tr>\n  <tr>\n    <td>Cell 4</td>\n    <td>Cell 5</td>\n    <td>Cell 6</td>\n  </tr>\n</table>\n\n<hr>\n\n<p>Special elements: <sub>subscript</sub>, <sup>superscript</sup>, <mark>highlighted text</mark></p>\n\n<div>This is a div element</div>\n<span>This is a span element</span>\n\n<br>\n<p>Line break above this paragraph</p>")},disabled:s,children:"All HTML Elements"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<h1>The Digital Adventure</h1>\n\n<h2>Chapter 1: The Discovery</h2>\n\n<p>In the heart of Silicon Valley, a young developer named Alex stumbled upon something extraordinary. While debugging an old codebase at <strong>3 AM</strong>, they discovered a hidden function that seemed to defy all logic.</p>\n\n<blockquote>\"The best code is the code you don't have to write.\" - Anonymous Developer</blockquote>\n\n<p>Alex's journey began with three simple steps:</p>\n\n<ol>\n  <li>Read the documentation (surprisingly helpful)</li>\n  <li>Write clean, testable code</li>\n  <li>Refactor mercilessly</li>\n</ol>\n\n<h2>Chapter 2: The Challenge</h2>\n\n<p>The project requirements were clear but ambitious:</p>\n\n<ul>\n  <li>Build a <em>real-time</em> collaboration tool</li>\n  <li>Support <strong>millions</strong> of concurrent users</li>\n  <li>Maintain <u>zero downtime</u> during deployments</li>\n  <li>Keep the codebase maintainable</li>\n</ul>\n\n<p>As Alex dove deeper, they realized that <code>success === (hardWork + creativity) * persistence</code>.</p>\n\n<h3>The Breakthrough</h3>\n\n<p>After countless cups of coffee and debugging sessions, the solution emerged:</p>\n\n<pre>function solve(problem) {\n  if (problem.isSolved) {\n    return celebrate();\n  }\n  return solve(problem.breakdown());\n}</pre>\n\n<h2>Epilogue</h2>\n\n<p>The project launched successfully. Alex learned that the journey of <sup>10,000</sup> commits begins with a single <code>git init</code>.</p>\n\n<p><strong>The End</strong></p>")},disabled:s,children:"Story (Plain)"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<h1 style="color: #2563eb; font-size: 32px; margin-bottom: 16px; border-bottom: 3px solid #3b82f6; padding-bottom: 8px;">The Digital Adventure</h1>\n\n<h2 style="color: #7c3aed; font-size: 24px; margin-top: 24px; margin-bottom: 12px;">Chapter 1: The Discovery</h2>\n\n<p style="line-height: 1.8; margin-bottom: 16px; color: #1f2937;">In the heart of Silicon Valley, a young developer named Alex stumbled upon something extraordinary. While debugging an old codebase at <strong style="color: #dc2626; font-weight: bold;">3 AM</strong>, they discovered a hidden function that seemed to defy all logic.</p>\n\n<blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 20px 0; color: #4b5563; font-style: italic; background-color: #eff6ff; padding: 12px 16px; border-radius: 4px;">"The best code is the code you don\'t have to write." - Anonymous Developer</blockquote>\n\n<p style="line-height: 1.8; margin-bottom: 12px; color: #1f2937;">Alex\'s journey began with three simple steps:</p>\n\n<ol style="margin-left: 24px; margin-bottom: 16px; line-height: 2;">\n  <li style="color: #059669; margin-bottom: 8px;"><strong>Read the documentation</strong> (surprisingly helpful)</li>\n  <li style="color: #059669; margin-bottom: 8px;"><strong>Write clean, testable code</strong></li>\n  <li style="color: #059669; margin-bottom: 8px;"><strong>Refactor mercilessly</strong></li>\n</ol>\n\n<h2 style="color: #7c3aed; font-size: 24px; margin-top: 24px; margin-bottom: 12px;">Chapter 2: The Challenge</h2>\n\n<p style="line-height: 1.8; margin-bottom: 12px; color: #1f2937;">The project requirements were clear but ambitious:</p>\n\n<ul style="margin-left: 24px; margin-bottom: 16px; line-height: 2;">\n  <li style="color: #dc2626; margin-bottom: 8px;">Build a <em style="color: #ea580c;">real-time</em> collaboration tool</li>\n  <li style="color: #dc2626; margin-bottom: 8px;">Support <strong style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px;">millions</strong> of concurrent users</li>\n  <li style="color: #dc2626; margin-bottom: 8px;">Maintain <u style="text-decoration-color: #10b981;">zero downtime</u> during deployments</li>\n  <li style="color: #dc2626; margin-bottom: 8px;">Keep the codebase maintainable</li>\n</ul>\n\n<p style="line-height: 1.8; margin-bottom: 16px; color: #1f2937;">As Alex dove deeper, they realized that <code style="background-color: #1f2937; color: #10b981; padding: 4px 8px; border-radius: 4px; font-family: monospace;">success === (hardWork + creativity) * persistence</code>.</p>\n\n<h3 style="color: #8b5cf6; font-size: 20px; margin-top: 20px; margin-bottom: 10px;">The Breakthrough</h3>\n\n<p style="line-height: 1.8; margin-bottom: 12px; color: #1f2937;">After countless cups of coffee and debugging sessions, the solution emerged:</p>\n\n<pre style="background-color: #1f2937; color: #10b981; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: \'Courier New\', monospace; line-height: 1.5; border: 2px solid #3b82f6;">function solve(problem) {\n  if (problem.isSolved) {\n    return celebrate();\n  }\n  return solve(problem.breakdown());\n}</pre>\n\n<h2 style="color: #7c3aed; font-size: 24px; margin-top: 24px; margin-bottom: 12px;">Epilogue</h2>\n\n<p style="line-height: 1.8; margin-bottom: 16px; color: #1f2937;">The project launched successfully. Alex learned that the journey of <sup style="color: #3b82f6; font-weight: bold;">10,000</sup> commits begins with a single <code style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 3px;">git init</code>.</p>\n\n<p style="text-align: center; font-size: 20px; margin-top: 32px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;"><strong>The End</strong></p>')},disabled:s,children:"Story (Styled)"})]})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)(k.$n,{type:"primary",onClick:B,disabled:s||!n.trim(),children:s?"Injecting...":"Inject to Google Docs"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("")},disabled:s,children:"Clear"})]}),m&&(0,j.jsx)("div",{className:"rounded border p-3 ".concat(m.startsWith("Success")?"border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300":"border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"),children:(0,j.jsx)("div",{className:"text-sm font-medium",children:m})})]})};var Ao="Hello World";let Ai=function(A){var e=A.tabId,t=(0,f.useState)(Ao),r=(0,b.A)(t,2),n=r[0],a=r[1],o=(0,f.useState)(!1),i=(0,b.A)(o,2),s=i[0],l=i[1],d=(0,f.useState)(null),c=(0,b.A)(d,2),m=c[0],p=c[1],B=(0,f.useCallback)((0,E.A)(y().mark(function A(){var t,r;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return l(!0),p(null),A.prev=1,A.next=2,(0,An.MS)(e,n);case 2:p("Success: Text injected into Google Sheets"),A.next=4;break;case 3:A.prev=3,t=(r=A.catch(1))instanceof Error?r.message:String(r),p("Error: ".concat(t)),console.error("Failed to inject text:",r);case 4:return A.prev=4,l(!1),A.finish(4);case 5:case"end":return A.stop()}},A,null,[[1,3,4,5]])})),[e,n]);return(0,j.jsxs)("div",{className:"flex flex-col gap-4 p-4",children:[(0,j.jsx)("h3",{className:"text-header-l",children:"Google Sheets Text Injector"}),(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)("label",{className:"text-header-m",children:"Text Content:"}),(0,j.jsx)("textarea",{className:"min-h-[200px] rounded border border-gray-300 bg-color-neutral-92-60 p-2 font-mono text-sm text-color-text-01",value:n,onChange:function(A){return a(A.target.value)},placeholder:"Enter text content to inject into the active cell...",spellCheck:!1})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)("label",{className:"text-header-s",children:"Preset Examples:"}),(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("div",{className:"text-xs text-gray-500",children:"HTML Tables:"}),(0,j.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n    <th>City</th>\n  </tr>\n  <tr>\n    <td>Alice</td>\n    <td>28</td>\n    <td>New York</td>\n  </tr>\n  <tr>\n    <td>Bob</td>\n    <td>35</td>\n    <td>San Francisco</td>\n  </tr>\n</table>")},disabled:s,children:"Simple Table"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<table border="1">\n  <thead>\n    <tr>\n      <th>Product</th>\n      <th>Price</th>\n      <th>Stock</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Laptop</td>\n      <td>$999.99</td>\n      <td>45</td>\n      <td>In Stock</td>\n    </tr>\n    <tr>\n      <td>Mouse</td>\n      <td>$29.99</td>\n      <td>150</td>\n      <td>In Stock</td>\n    </tr>\n    <tr>\n      <td>Keyboard</td>\n      <td>$79.99</td>\n      <td>0</td>\n      <td>Out of Stock</td>\n    </tr>\n  </tbody>\n</table>')},disabled:s,children:"Products Table"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<table style="border-collapse: collapse; width: 100%;">\n  <tr style="background-color: #4CAF50; color: white;">\n    <th style="padding: 8px;">Quarter</th>\n    <th style="padding: 8px;">Revenue</th>\n    <th style="padding: 8px;">Growth</th>\n  </tr>\n  <tr>\n    <td style="padding: 8px; border: 1px solid #ddd;">Q1 2024</td>\n    <td style="padding: 8px; border: 1px solid #ddd;">$245,000</td>\n    <td style="padding: 8px; border: 1px solid #ddd;">+12%</td>\n  </tr>\n  <tr style="background-color: #f2f2f2;">\n    <td style="padding: 8px; border: 1px solid #ddd;">Q2 2024</td>\n    <td style="padding: 8px; border: 1px solid #ddd;">$289,000</td>\n    <td style="padding: 8px; border: 1px solid #ddd;">+18%</td>\n  </tr>\n</table>')},disabled:s,children:"Styled Table"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<table border="1" cellpadding="5">\n  <tr>\n    <th rowspan="2">Department</th>\n    <th colspan="2">Q1</th>\n    <th colspan="2">Q2</th>\n  </tr>\n  <tr>\n    <th>Sales</th>\n    <th>Target</th>\n    <th>Sales</th>\n    <th>Target</th>\n  </tr>\n  <tr>\n    <td>North</td>\n    <td>$50K</td>\n    <td>$45K</td>\n    <td>$55K</td>\n    <td>$50K</td>\n  </tr>\n  <tr>\n    <td>South</td>\n    <td>$45K</td>\n    <td>$40K</td>\n    <td>$52K</td>\n    <td>$48K</td>\n  </tr>\n</table>')},disabled:s,children:"Complex Table"})]})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("div",{className:"text-xs text-gray-500",children:"HTML Elements (Divs, Spans, Headings):"}),(0,j.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<div class="container">\n  <h1>Welcome to Our Store</h1>\n  <div class="product-card">\n    <span class="label">Product:</span>\n    <span class="value">Premium Laptop</span>\n  </div>\n  <div class="product-card">\n    <span class="label">Price:</span>\n    <span class="value">$1,299.99</span>\n  </div>\n  <div class="product-card">\n    <span class="label">Status:</span>\n    <span class="badge-success">In Stock</span>\n  </div>\n</div>')},disabled:s,children:"Divs & Spans"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<div>\n  <h1>Main Title - H1</h1>\n  <h2>Section Title - H2</h2>\n  <h3>Subsection Title - H3</h3>\n  <h4>Minor Heading - H4</h4>\n  <h5>Smaller Heading - H5</h5>\n  <h6>Smallest Heading - H6</h6>\n  <p>Regular paragraph text follows the headings.</p>\n</div>")},disabled:s,children:"Headings H1-H6"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<div class="dashboard">\n  <header>\n    <h1>User Dashboard</h1>\n    <nav>\n      <a href="#overview">Overview</a> |\n      <a href="#analytics">Analytics</a> |\n      <a href="#settings">Settings</a>\n    </nav>\n  </header>\n  <main>\n    <section class="stats">\n      <div class="stat-card">\n        <h3>Total Users</h3>\n        <span class="number">12,345</span>\n      </div>\n      <div class="stat-card">\n        <h3>Active Sessions</h3>\n        <span class="number">1,876</span>\n      </div>\n      <div class="stat-card">\n        <h3>Revenue</h3>\n        <span class="number">$45,678</span>\n      </div>\n    </section>\n  </main>\n  <footer>\n    <p>&copy; 2025 Company Name. All rights reserved.</p>\n  </footer>\n</div>')},disabled:s,children:"Nested Structure"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<form action="/submit" method="POST">\n  <fieldset>\n    <legend>Contact Information</legend>\n    <label for="name">Name:</label>\n    <input type="text" id="name" name="name" required>\n\n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email" required>\n\n    <label for="message">Message:</label>\n    <textarea id="message" name="message" rows="4"></textarea>\n\n    <button type="submit">Submit</button>\n  </fieldset>\n</form>')},disabled:s,children:"Form"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<div>\n  <h3>Unordered List</h3>\n  <ul>\n    <li>First item</li>\n    <li>Second item</li>\n    <li>Third item</li>\n  </ul>\n\n  <h3>Ordered List</h3>\n  <ol>\n    <li>Step one</li>\n    <li>Step two</li>\n    <li>Step three</li>\n  </ol>\n\n  <h3>Description List</h3>\n  <dl>\n    <dt>HTML</dt>\n    <dd>HyperText Markup Language</dd>\n    <dt>CSS</dt>\n    <dd>Cascading Style Sheets</dd>\n    <dt>JS</dt>\n    <dd>JavaScript</dd>\n  </dl>\n</div>")},disabled:s,children:"Lists"})]})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("div",{className:"text-xs text-gray-500",children:"Semantic HTML:"}),(0,j.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<article>\n  <header>\n    <h1>Understanding AI Technology</h1>\n    <p>Published on November 20, 2025</p>\n  </header>\n  <section>\n    <h2>Introduction</h2>\n    <p>Artificial Intelligence is transforming our world...</p>\n  </section>\n  <section>\n    <h2>Key Benefits</h2>\n    <ul>\n      <li>Automation of repetitive tasks</li>\n      <li>Enhanced decision making</li>\n      <li>Improved efficiency</li>\n    </ul>\n  </section>\n  <footer>\n    <p>Author: John Doe</p>\n  </footer>\n</article>")},disabled:s,children:"Article"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#products">Products</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#about">About Us</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>')},disabled:s,children:"Navigation"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<main>\n  <section id="hero">\n    <h1>Welcome to Our Platform</h1>\n    <p>The best solution for your business needs</p>\n  </section>\n  <section id="features">\n    <h2>Features</h2>\n    <div class="feature">\n      <h3>Fast Performance</h3>\n      <p>Lightning-fast processing speeds</p>\n    </div>\n    <div class="feature">\n      <h3>Secure</h3>\n      <p>Enterprise-grade security</p>\n    </div>\n  </section>\n  <aside>\n    <h3>Latest News</h3>\n    <p>Check out our newest updates and announcements</p>\n  </aside>\n</main>')},disabled:s,children:"Main & Sections"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<figure>\n  <img src="chart.png" alt="Sales Chart 2024" width="600" height="400">\n  <figcaption>\n    <strong>Figure 1:</strong> Annual sales performance showing\n    <em>23% growth</em> compared to previous year\n  </figcaption>\n</figure>')},disabled:s,children:"Figure"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("<details>\n  <summary>Click to view product specifications</summary>\n  <div>\n    <h4>Technical Specifications</h4>\n    <dl>\n      <dt>Processor:</dt>\n      <dd>Intel Core i7-12700K</dd>\n      <dt>Memory:</dt>\n      <dd>32GB DDR5 RAM</dd>\n      <dt>Storage:</dt>\n      <dd>1TB NVMe SSD</dd>\n      <dt>Graphics:</dt>\n      <dd>NVIDIA RTX 4070</dd>\n    </dl>\n  </div>\n</details>")},disabled:s,children:"Details"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('<article>\n  <h2>Important Event</h2>\n  <p>\n    The conference will take place on\n    <time datetime="2025-12-15T09:00">December 15, 2025 at 9:00 AM</time>\n  </p>\n  <p>\n    Please note: <mark>Registration deadline is December 1st</mark>\n  </p>\n  <p>\n    <strong>Important:</strong> All attendees must bring\n    <em>valid identification</em>\n  </p>\n</article>')},disabled:s,children:"Time & Mark"})]})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("div",{className:"text-xs text-gray-500",children:"Plain Text:"}),(0,j.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a(Ao)},disabled:s,children:"Simple Text"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("Shopping List:\n- Milk\n- Eggs\n- Bread\n- Butter\n- Coffee")},disabled:s,children:"List"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("Employee Record\nName: John Doe\nDepartment: Engineering\nPosition: Senior Developer\nHire Date: 2020-03-15\nSalary: $95,000")},disabled:s,children:"Structured Data"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("Meeting Notes - Project Kickoff\n\nDate: November 20, 2025\nAttendees: Alice, Bob, Carol, David\n\nAgenda:\n1. Project timeline review\n2. Resource allocation\n3. Risk assessment\n4. Next steps\n\nAction Items:\n- Alice: Prepare project charter (Due: Nov 25)\n- Bob: Set up development environment (Due: Nov 22)\n- Carol: Schedule stakeholder meeting (Due: Nov 21)")},disabled:s,children:"Meeting Notes"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("Product     | Price   | Quantity | Total\n------------|---------|----------|--------\nLaptop      | $999.99 | 2        | $1,999.98\nMouse       | $29.99  | 5        | $149.95\nKeyboard    | $79.99  | 3        | $239.97\nMonitor     | $299.99 | 1        | $299.99\n------------|---------|----------|--------\nTOTAL       |         |          | $2,689.89")},disabled:s,children:"Text Table"})]})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("div",{className:"text-xs text-gray-500",children:"Formulas:"}),(0,j.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("=SUM(A1:A10)")},disabled:s,children:"SUM"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("=AVERAGE(B2:B50)")},disabled:s,children:"AVERAGE"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('=IF(C2>100, "High", "Low")')},disabled:s,children:"IF"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("=VLOOKUP(A2, Sheet2!A:D, 3, FALSE)")},disabled:s,children:"VLOOKUP"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('=SUMIF(D:D, ">1000", E:E)')},disabled:s,children:"SUMIF"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("=IF(AND(A2>0, B2<100), SUM(C2:C10)*0.9, SUM(C2:C10))")},disabled:s,children:"Nested"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('=COUNTIF(A:A, "Completed")')},disabled:s,children:"COUNTIF"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("=INDEX(B:B, MATCH(E2, A:A, 0))")},disabled:s,children:"INDEX MATCH"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("=ARRAYFORMULA(A2:A10 * B2:B10)")},disabled:s,children:"Array"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('=DATEDIF(A2, TODAY(), "D")')},disabled:s,children:"Date Calc"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a('=CONCATENATE(A2, " ", B2, " - ", C2)')},disabled:s,children:"CONCATENATE"})]})]})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)(k.$n,{type:"primary",onClick:B,disabled:s||!n.trim(),children:s?"Injecting...":"Inject to Google Sheets"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return a("")},disabled:s,children:"Clear"})]}),m&&(0,j.jsx)("div",{className:"rounded border p-3 ".concat(m.startsWith("Success")?"border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300":"border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"),children:(0,j.jsx)("div",{className:"text-sm font-medium",children:m})})]})};var As=t(89601);function Al(A,e){var t=Object.keys(A);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(A);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(A,e).enumerable})),t.push.apply(t,r)}return t}function Ad(A){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?Al(Object(t),!0).forEach(function(e){(0,C.A)(A,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(A,Object.getOwnPropertyDescriptors(t)):Al(Object(t)).forEach(function(e){Object.defineProperty(A,e,Object.getOwnPropertyDescriptor(t,e))})}return A}var Ac=function(A){var e=A.groupId,t=(0,f.useState)([{url:"https://example.com",selected:!0},{url:"https://en.wikipedia.org/wiki/Opera_(web_browser)",selected:!0},{url:"https://www.bbc.com/news",selected:!1},{url:"https://stackoverflow.com/questions",selected:!1},{url:"https://github.com/trending",selected:!1}]),r=(0,b.A)(t,2),n=r[0],a=r[1],o=(0,f.useState)(""),i=(0,b.A)(o,2),s=i[0],l=i[1],d=(0,f.useState)(!1),c=(0,b.A)(d,2),m=c[0],p=c[1],B=(0,f.useState)(!1),g=(0,b.A)(B,2),h=g[0],x=g[1],u=(0,f.useState)([]),v=(0,b.A)(u,2),C=v[0],I=v[1],N=(0,f.useCallback)(function(A,e){var t="string"==typeof e?{textContent:e,urlElements:[]}:e;console.log("Text content fetched:",{url:A,contentLength:t.textContent.length,urlElementsCount:t.urlElements.length,apiVersion:"string"==typeof e?"V1.0":"V1.1"}),I(function(e){return[].concat((0,w.A)(e),[{url:A,content:t}])})},[]),S=(0,f.useCallback)(function(){m?((0,As.Oz)(N),p(!1)):((0,As.CC)(N),p(!0))},[m,N]),z=(0,f.useCallback)(function(A){a(function(e){return e.map(function(e){return e.url===A?Ad(Ad({},e),{},{selected:!e.selected}):e})})},[]),D=(0,f.useCallback)(function(){var A=s.trim();if(A){if(n.some(function(e){return e.url===A}))return void console.warn("URL already exists in the list");a(function(e){return[].concat((0,w.A)(e),[{url:A,selected:!0}])}),l("")}},[s,n]),O=(0,f.useCallback)(function(A){a(function(e){return e.filter(function(e){return e.url!==A})})},[]),T=(0,f.useCallback)(function(){a(function(A){return A.map(function(A){return Ad(Ad({},A),{},{selected:!0})})})},[]),P=(0,f.useCallback)(function(){a(function(A){return A.map(function(A){return Ad(Ad({},A),{},{selected:!1})})})},[]),M=(0,f.useCallback)((0,E.A)(y().mark(function A(){var t;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:if(e){A.next=1;break}return console.error("No group ID available"),A.abrupt("return");case 1:if(0!==(t=n.filter(function(A){return A.selected}).map(function(A){return A.url})).length){A.next=2;break}return console.error("No URLs selected to fetch"),A.abrupt("return");case 2:return console.log("Fetching text content for URLs:",t,"includeURLElements:",h),A.next=3,(0,As.rd)(e,t,h);case 3:console.log("Fetch result:",A.sent);case 4:case"end":return A.stop()}},A)})),[e,n,h]),_=(0,f.useCallback)(function(){I([])},[]),U=(0,f.useCallback)(function(A,e){try{var t=document.createElement("textarea");t.value=A,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select(),t.setSelectionRange(0,A.length);var r=document.execCommand("copy");document.body.removeChild(t),r?console.log("Content from ".concat(e," copied to clipboard (").concat(A.length," chars)")):console.error("Failed to copy to clipboard")}catch(A){console.error("Failed to copy to clipboard:",A)}},[]);return(0,f.useEffect)(function(){return function(){m&&(0,As.Oz)(N)}},[m,N]),(0,j.jsxs)("div",{className:"flex flex-col gap-3",children:[(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[e&&(0,j.jsxs)("div",{className:"text-xs text-gray-500",children:["Group ID: ",e]}),!e&&(0,j.jsx)("div",{className:"text-xs text-red-500",children:"No group ID available"})]}),(0,j.jsxs)("div",{className:"flex gap-4",children:[(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsxs)("div",{className:"flex items-center justify-between",children:[(0,j.jsxs)("div",{className:"text-header-s",children:["URLs to Fetch (",n.filter(function(A){return A.selected}).length,"/",n.length," selected)"]}),(0,j.jsxs)("div",{className:"flex gap-2",children:[(0,j.jsx)(k.$n,{type:"secondary",onClick:T,children:"Select All"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:P,children:"Deselect All"})]})]}),(0,j.jsx)("div",{className:"max-h-[250px] min-w-[500px] overflow-y-auto rounded border border-gray-300 bg-color-neutral-92-60 p-2",children:n.map(function(A,e){return(0,j.jsxs)("div",{className:"mb-1 flex items-center gap-2",children:[(0,j.jsx)("input",{type:"checkbox",checked:A.selected,onChange:function(){return z(A.url)}}),(0,j.jsx)("div",{className:"flex-1 truncate text-sm",children:A.url}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return O(A.url)},className:"text-xs",children:"Remove"})]},e)})}),(0,j.jsxs)("div",{className:"flex gap-2",children:[(0,j.jsx)("input",{type:"text",className:"flex-1 rounded border border-gray-300 bg-color-neutral-92-60 p-2 text-sm text-color-text-01",placeholder:"Enter custom URL",value:s,onChange:function(A){return l(A.target.value)},onKeyDown:function(A){"Enter"===A.key&&D()}}),(0,j.jsx)(k.$n,{type:"primary",onClick:D,children:"Add URL"})]})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)(k.$n,{type:"primary",onClick:M,disabled:!e,children:"Fetch Text Content"}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("p",{children:"Include URL elements"}),(0,j.jsx)(K.l,{id:"include-url-elements",testName:"include-url-elements",checked:h,setChecked:x})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("p",{children:"Listen to fetch events"}),(0,j.jsx)(K.l,{id:"text-fetcher-listener",testName:"text-fetcher-listener",checked:m,setChecked:S})]}),(0,j.jsx)(k.$n,{type:"secondary",onClick:_,children:"Clear Results"})]})]}),C.length>0&&(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsxs)("div",{className:"text-header-s",children:["Fetched Contents (",C.length,")"]}),(0,j.jsx)("div",{className:"max-h-[400px] overflow-y-auto",children:C.map(function(A,e){var t=(new Blob([A.content.textContent]).size/1024).toFixed(2);return(0,j.jsxs)("div",{className:"mb-2 rounded border border-gray-200 p-2",children:[(0,j.jsxs)("div",{className:"mb-2 flex items-start justify-between gap-2",children:[(0,j.jsxs)("div",{className:"flex-1",children:[(0,j.jsx)("div",{className:"mb-1 font-bold text-blue-600",children:A.url}),(0,j.jsxs)("div",{className:"text-xs text-gray-500",children:["Size: ",t," KB (",A.content.textContent.length," chars)",A.content.urlElements.length>0&&" | URL Elements: ".concat(A.content.urlElements.length)]})]}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return U(A.content.textContent,A.url)},children:"Copy to Clipboard"})]}),(0,j.jsxs)("div",{className:"mt-1 max-h-[150px] overflow-y-auto bg-color-neutral-92-60 p-2 text-xs",children:[A.content.textContent.substring(0,1e3),A.content.textContent.length>1e3?"...":""]}),A.content.urlElements.length>0&&(0,j.jsxs)("div",{className:"mt-2",children:[(0,j.jsx)("div",{className:"mb-1 text-xs font-semibold",children:"URL Elements:"}),(0,j.jsx)("div",{className:"max-h-[100px] overflow-y-auto bg-color-neutral-92-60 p-2",children:A.content.urlElements.map(function(A,e){return(0,j.jsxs)("div",{className:"mb-1 border-b border-gray-300 pb-1 text-xs",children:[(0,j.jsx)("div",{className:"font-semibold text-blue-600",children:A.name}),(0,j.jsx)("div",{className:"text-gray-600",children:A.url}),A.htmlTag&&(0,j.jsxs)("div",{className:"text-gray-500",children:["Tag: ",A.htmlTag]}),A.role&&(0,j.jsxs)("div",{className:"text-gray-500",children:["Role: ",A.role]})]},e)})})]})]},e)})})]})]})},Am=t(27937),Ap=function(){var A=(0,f.useState)([]),e=(0,b.A)(A,2),t=e[0],r=e[1],n=(0,f.useState)(500),a=(0,b.A)(n,2),o=a[0],i=a[1],s=(0,f.useState)(!1),l=(0,b.A)(s,2),d=l[0],c=l[1],m=(0,f.useRef)(null),p=(0,f.useCallback)((0,E.A)(y().mark(function A(){var e,t,n,a;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,(0,Am.G)();case 1:e=A.sent,t={timestamp:new Date().toLocaleTimeString(),data:JSON.stringify(e,null,2)},r(function(A){return[t].concat((0,w.A)(A)).slice(0,5)}),A.next=3;break;case 2:A.prev=2,a=A.catch(0),n={timestamp:new Date().toLocaleTimeString(),data:"Error: ".concat(a)},r(function(A){return[n].concat((0,w.A)(A)).slice(0,5)});case 3:case"end":return A.stop()}},A,null,[[0,2]])})),[]),B=(0,f.useCallback)(function(){m.current||(c(!0),p(),m.current=setInterval(p,o))},[p,o]),g=(0,f.useCallback)(function(){m.current&&(clearInterval(m.current),m.current=null),c(!1)},[]);return(0,f.useEffect)(function(){return function(){m.current&&clearInterval(m.current)}},[]),(0,j.jsxs)("div",{className:"flex flex-col gap-3 p-2",children:[(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)(k.$n,{type:"primary",onClick:p,children:"Fetch Once"}),(0,j.jsx)("div",{className:"text-header-m",children:"Interval (ms):"}),(0,j.jsx)(Z,{className:"h-8 min-w-20 max-w-24",value:o,type:"number",onChange:function(A){return i(+A.target.value)}}),d?(0,j.jsx)(k.$n,{type:"secondary",onClick:g,children:"Stop Polling"}):(0,j.jsx)(k.$n,{type:"primary",onClick:B,children:"Start Polling"}),d&&(0,j.jsxs)("div",{className:"text-xs text-green-500",children:["Polling every ",o,"ms..."]})]}),t.length>0&&(0,j.jsx)("div",{className:"flex flex-col gap-2",children:t.map(function(A,e){return(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("span",{className:"text-xs font-bold text-color-text-01",children:A.timestamp}),0===e&&(0,j.jsx)("span",{className:"rounded bg-blue-500 px-1 py-0.5 text-xs text-white",children:"latest"})]}),(0,j.jsx)("pre",{className:"whitespace-pre-wrap rounded bg-color-neutral-92-60 p-2 text-xs",children:A.data})]},A.timestamp+e)})})]})},AB=t(51939),Ag=t(11929),Ah=t(28172);function Ax(A,e){(null==e||e>A.length)&&(e=A.length);for(var t=0,r=Array(e);t<e;t++)r[t]=A[t];return r}var Au=function(){var A,e,t,r,n,a,o,i,s,l,d,c=S(),m=c.tabId,p=c.setTabId,B=c.groupId,g=c.setGroupId,h=c.windowId,x=c.setWindowId,u=(0,f.useState)("axTree"),v=(0,b.A)(u,2),C=v[0],I=v[1],N=(0,f.useState)(""),D=(0,b.A)(N,2),O=D[0],T=D[1],M=(0,f.useState)(""),_=(0,b.A)(M,2),U=_[0],F=_[1],Y=(0,f.useState)(0),R=(0,b.A)(Y,2),q=R[0],H=R[1],V=(0,f.useState)(0),Ae=(0,b.A)(V,2),At=Ae[0],Ao=Ae[1],As=(0,f.useState)(""),Al=(0,b.A)(As,2),Ad=Al[0],Am=Al[1],Au=(0,f.useState)(null),Ab=(0,b.A)(Au,2),Af=Ab[0],Aw=Ab[1],AE=(0,f.useState)(null),Av=(0,b.A)(AE,2),Ay=Av[0],Ak=Av[1],AC=(0,f.useState)(null),Aj=(0,b.A)(AC,2),AI=Aj[0],AN=Aj[1],AS=(0,f.useState)(null),Az=(0,b.A)(AS,2),AD=Az[0],AO=Az[1],AT=(0,f.useState)([]),AP=(0,b.A)(AT,2),AM=AP[0],A_=AP[1],AU=(0,f.useState)(),A$=(0,b.A)(AU,2),AL=A$[0],AF=A$[1],AY=(0,f.useState)(),AR=(0,b.A)(AY,2),Aq=AR[0],AH=AR[1],AX=(0,f.useState)("https://www.eviltester.com/selenium/basic_html_form.html"),AG=(0,b.A)(AX,2),AK=AG[0],AW=AG[1],AV=(0,f.useState)(1),AZ=(0,b.A)(AV,2),AQ=AZ[0],AJ=AZ[1],A0=(0,f.useState)("a"),A1=(0,b.A)(A0,2),A2=A1[0],A5=A1[1],A3=(0,f.useState)("test"),A4=(0,b.A)(A3,2),A8=A4[0],A6=A4[1],A9=(0,f.useState)([]),A7=(0,b.A)(A9,2),eA=A7[0],ee=A7[1],et=(0,f.useState)(!0),er=(0,b.A)(et,2),en=er[0],ea=er[1],eo=(0,f.useState)("page-scan"),ei=(0,b.A)(eo,2),es=ei[0],el=ei[1],ed=(0,f.useState)(!0),ec=(0,b.A)(ed,2),em=ec[0],ep=ec[1],eB=(0,f.useState)(2e3),eg=(0,b.A)(eB,2),eh=eg[0],ex=eg[1],eu=G(m),eb=eu.resetCounter,ef=eu.toggleListener,ew=eu.isListening,eE=eu.count,ev=(0,f.useCallback)((A=(0,E.A)(y().mark(function A(e){var t,r,n,a,o;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,(0,P.AB)(e);case 1:t=A.sent,r=(0,P.DP)(t),console.log("AX TREE",t),console.log("Filtered TREE",r),a=(n=(0,P.I8)(t)).orphanNodes,o=n.missingParentsIds,AO(a),A_(o),Ak(t),AN(r);case 2:case"end":return A.stop()}},A)})),function(e){return A.apply(this,arguments)}),[]),ey=(0,f.useCallback)(function(A){F(+A.target.value)},[F]),ek=(0,f.useCallback)(function(A){Am(A.target.value)},[Am]),eC=(0,f.useCallback)(function(A){AW(A.target.value)},[]),ej=(0,f.useCallback)((0,E.A)(y().mark(function A(){var e,t,r,n;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,new Promise(function(A){return chrome.tabs.query({},A)});case 1:ee(r=A.sent),p(null!=(e=null!=(t=null==(n=r.find(function(A){return A.active}))?void 0:n.id)?t:r[0].id)?e:0),g(null!=n&&n.groupId&&-1!==n.groupId?n.groupId:null),x((null==n?void 0:n.windowId)||null),T((null==n?void 0:n.url)||"");case 2:case"end":return A.stop()}},A)})),[g,p,x]),eI=(0,f.useCallback)((0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,chrome.tabs.reload(m);case 1:A.next=3;break;case 2:A.prev=2,console.error("Can not force refresh tab",A.catch(0));case 3:case"end":return A.stop()}},A,null,[[0,2]])})),[m]),eN=(e=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,chrome.scripting.executeScript({target:{tabId:m},func:function(){var A=document.documentElement.scrollHeight,e=0,t=function(){e+=100,window.scrollTo(0,e),e<A&&setTimeout(t,50)};t()}});case 1:A.next=3;break;case 2:A.prev=2,console.error("Scroll failed:",A.catch(0));case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(){return e.apply(this,arguments)}),eS=(0,f.useCallback)((0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,(0,Ag.NV)(m,{type:es,repeating:em,duration:em?void 0:eh});case 1:A.next=3;break;case 2:A.prev=2,console.error("Failed to start shader animation:",A.catch(0));case 3:case"end":return A.stop()}},A,null,[[0,2]])})),[m,es,em,eh]),ez=(0,f.useCallback)((0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,(0,Ag.Nm)(m);case 1:A.next=3;break;case 2:A.prev=2,console.error("Failed to stop shader animation:",A.catch(0));case 3:case"end":return A.stop()}},A,null,[[0,2]])})),[m]),eD=(t=(0,E.A)(y().mark(function A(e){var t;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,(0,P.pP)(e,m);case 1:(t=A.sent)&&Aw(t);case 2:case"end":return A.stop()}},A)})),function(A){return t.apply(this,arguments)}),eO=(r=(0,E.A)(y().mark(function A(){var e,t,r,n;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:if(!(B&&h)){A.next=9;break}e=function(A){var e="u">typeof Symbol&&A[Symbol.iterator]||A["@@iterator"];if(!e){if(Array.isArray(A)||(e=function(A){if(A){if("string"==typeof A)return Ax(A,void 0);var e=({}).toString.call(A).slice(8,-1);return"Object"===e&&A.constructor&&(e=A.constructor.name),"Map"===e||"Set"===e?Array.from(A):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?Ax(A,void 0):void 0}}(A))){e&&(A=e);var t=0,r=function(){};return{s:r,n:function(){return t>=A.length?{done:!0}:{done:!1,value:A[t++]}},e:function(A){throw A},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,a=!0,o=!1;return{s:function(){e=e.call(A)},n:function(){var A=e.next();return a=A.done,A},e:function(A){o=!0,n=A},f:function(){try{a||null==e.return||e.return()}finally{if(o)throw n}}}}(Array(AQ).fill(AK)),A.prev=1,e.s();case 2:if((t=e.n()).done){A.next=6;break}if(r=t.value,!en){A.next=4;break}return A.next=3,(0,J.qo)(B,r);case 3:A.next=5;break;case 4:return A.next=5,(0,AA.fn)(r,B,h,m,!1);case 5:A.next=2;break;case 6:A.next=8;break;case 7:A.prev=7,n=A.catch(1),e.e(n);case 8:return A.prev=8,e.f(),A.finish(8);case 9:case"end":return A.stop()}},A,null,[[1,7,8,9]])})),function(){return r.apply(this,arguments)}),eT=(n=(0,E.A)(y().mark(function A(e){var t,r,n,a,o,i,s,l;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,(0,P.pP)(e,m);case 1:if(!((t=A.sent)&&t.boundingBox)){A.next=3;break}return n=(r=t.boundingBox).x,a=r.y,o=r.width,i=r.height,s=Math.round(n+o/2),l=Math.round(a+i/2),A.next=2,z(m,{x:s,y:l});case 2:return A.next=3,(0,P.VI)(m,s,l);case 3:case"end":return A.stop()}},A)})),function(A){return n.apply(this,arguments)}),eP=(a=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,z(m,{x:q,y:At});case 1:return A.next=2,(0,P.VI)(m,q,At);case 2:case"end":return A.stop()}},A)})),function(){return a.apply(this,arguments)}),eM=(o=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,(0,P.xb)(m,A2);case 1:case"end":return A.stop()}},A)})),function(){return o.apply(this,arguments)}),e_=(i=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:(0,Ah.tY)(m,A8);case 1:case"end":return A.stop()}},A)})),function(){return i.apply(this,arguments)}),eU=(s=(0,E.A)(y().mark(function A(){var e,t,r;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:if(!(h&&m)){A.next=2;break}return A.next=1,(0,W.mI)(h,m);case 1:if(!(e=A.sent)){A.next=2;break}return t=new Date().toISOString().replace(/[:.]/g,"-"),r="screenshot-tab-".concat(m,"-").concat(t,".png"),A.next=2,chrome.downloads.download({url:e,filename:r,saveAs:!1});case 2:case"end":return A.stop()}},A)})),function(){return s.apply(this,arguments)});(0,f.useEffect)(function(){ej()},[]);var e$=O.startsWith("https://docs.google.com/document")||O.startsWith("https://docs.google.com/")&&!O.includes("/spreadsheets"),eL=O.startsWith("https://docs.google.com/spreadsheets"),eF=[{id:"axTree",label:"Ax Tree"},{id:"tab",label:"Tab Info"},{id:"textFetcher",label:"Text Fetcher"},{id:"hardware",label:"Hardware"}].concat((0,w.A)(e$?[{id:"gdocs",label:"GDocs"}]:[]),(0,w.A)(eL?[{id:"gsheets",label:"GSheets"}]:[]));return(0,j.jsxs)("div",{className:"flex flex-col gap-3",children:[(0,j.jsx)("h3",{className:"text-header-xl text-center ",children:"Operator Devtools"}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"TAB ID:"}),m&&(0,j.jsx)("div",{className:"flex items-center gap-2",children:(0,j.jsx)("div",{children:m})}),(0,j.jsx)(k.$n,{type:"primary",onClick:ej,children:"Refresh Tabs"}),(0,j.jsx)("select",{value:m,onChange:function(A){var e=+A.target.value;p(e);var t=eA.find(function(A){return A.id===e});t&&(g(null!=t&&t.groupId&&-1!==t.groupId?t.groupId:null),x((null==t?void 0:t.windowId)||null),T((null==t?void 0:t.url)||""))},children:eA.map(function(A){var e,t;return(0,j.jsxs)("option",{value:A.id,children:[null==(e=A.title)?void 0:e.substring(0,32)," - ",null==(t=A.url)?void 0:t.substring(0,50)," - WinID:",A.windowId]},A.id)})})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)(k.$n,{type:"primary",onClick:eI,children:"Reload Tab"}),(0,j.jsx)(k.$n,{type:"primary",onClick:eN,children:"Scroll Down"}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return(0,Q.r)(m,!0)},children:"Youtube Extract"})]}),B&&h&&(0,j.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,j.jsxs)("div",{className:"flex gap-2",children:[(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("select",{value:AL||"",onChange:function(A){return AF(A.target.value)},children:Object.values(AB.J6).map(function(A){return(0,j.jsx)("option",{value:A,children:A},A)})}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return AL&&(0,AB.BC)(B,AL,h)},children:"Start Animation"}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return(0,AB.Hg)(B,h)},children:"Stop Animation"})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"URL:"}),(0,j.jsx)(k.ks,{className:"h-8 min-w-16 max-w-28",value:AK,onChange:eC}),(0,j.jsx)("div",{className:"text-header-m",children:"Number of tabs:"}),(0,j.jsx)(Z,{className:"h-8 min-w-12 max-w-16",value:AQ,type:"number",onChange:function(A){return AJ(+A.target.value)}}),(0,j.jsx)(k.$n,{type:"secondary",onClick:eO,children:"Open Tabs in Background"}),(0,j.jsx)(K.l,{id:"tabPrivate-toggle",testName:"tabPrivate-toggle",checked:en,setChecked:ea}),(0,j.jsx)("p",{children:"TabPrivate method"})]})]}),(null==(l=opr.browserOperatorPrivate)?void 0:l.BrowserOperatorStatus)&&(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("select",{value:Aq||"",onChange:function(A){return AH(A.target.value)},children:Object.values(null==(d=opr.browserOperatorPrivate)?void 0:d.BrowserOperatorStatus).map(function(A){return(0,j.jsx)("option",{value:A,children:A},A)})}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return Aq&&(0,P.Go)(B,Aq)},children:"Set Operator Status"})]})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"Page Shader Animation"}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("select",{value:es,onChange:function(A){return el(A.target.value)},children:(0,j.jsx)("option",{value:"page-scan",children:"Heartbeat ECG"})}),(0,j.jsx)(K.l,{id:"shader-repeating-toggle",testName:"shader-repeating-toggle",checked:em,setChecked:ep}),(0,j.jsx)("p",{children:"Repeating"}),!em&&(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)("div",{className:"text-header-m",children:"Duration (ms):"}),(0,j.jsx)(Z,{className:"h-8 min-w-20 max-w-24",value:eh,type:"number",onChange:function(A){return ex(+A.target.value)}})]}),(0,j.jsx)(k.$n,{type:"primary",onClick:eS,children:"Start Shader"}),(0,j.jsx)(k.$n,{type:"primary",onClick:ez,children:"Stop Shader"})]})]}),(0,j.jsxs)("div",{className:"flex gap-2",children:[(0,j.jsx)(k.$n,{className:"mr-4",type:"primary",onClick:function(){return m&&ev(+m)},disabled:!m,children:"Refresh Tree"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return(0,P.ig)()},children:"Get Ax Debug String"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return(0,P.RH)(m)},children:"Go Back"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return(0,P.DX)(m)},children:"Stop Highlight"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return(0,P.XK)(m)},children:"Finish Operator Flow"}),(0,j.jsx)(k.$n,{type:"primary",onClick:eU,children:"Get Tab Screenshot"}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return(0,An.BQ)(m)},children:"Get Google Docs Content"})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"NodeID:"}),(0,j.jsx)(k.ks,{className:"h-8 min-w-12 max-w-16",value:String(U),onChange:ey}),(0,j.jsx)("div",{className:"text-header-m",children:"Set value:"}),(0,j.jsx)(k.ks,{className:"h-8 min-w-12 max-w-22 ",value:Ad,onChange:ek}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return U&&Ad&&(0,P.w$)(U,Ad,m)},disabled:!(U&&Ad),children:"Set Value Action"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return U&&(0,P.i5)(U,m)},disabled:!U,children:"Highlight"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return U&&(0,P.iK)(U,m)},disabled:!U,children:"Default Action"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return U&&eT(U)},disabled:!U,children:"Click Coords"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return U&&(0,P.K9)(U,m)},disabled:!U,children:"Focus"}),(0,j.jsx)(k.$n,{type:"secondary",onClick:function(){return U&&eD(U)},disabled:!U,children:"Get Node Data"})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"X:"}),(0,j.jsx)(Z,{className:"h-8 min-w-12 max-w-16",value:q,type:"number",onChange:function(A){return H(+A.target.value)}}),(0,j.jsx)("div",{className:"text-header-m",children:"Y:"}),(0,j.jsx)(Z,{className:"h-8 min-w-12 max-w-16",value:At,type:"number",onChange:function(A){return Ao(+A.target.value)}}),(0,j.jsx)(k.$n,{type:"secondary",onClick:eP,children:"Click on coords"})]}),(0,j.jsxs)("div",{className:"flex gap-2",children:[(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"Key:"}),(0,j.jsx)(Z,{className:"h-8 min-w-36 max-w-16",value:A2,type:"text",onChange:function(A){return A5(A.target.value)}}),(0,j.jsx)(k.$n,{type:"secondary",onClick:eM,children:"Send Key"})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("div",{className:"text-header-m",children:"Text to send:"}),(0,j.jsx)("textarea",{className:"bg-color-neutral-92-60 p-1 text-color-text-01",value:A8,onChange:function(A){return A6(A.target.value)}}),(0,j.jsx)(k.$n,{type:"secondary",onClick:e_,children:"Send Text"})]})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[(0,j.jsx)("p",{children:"Listen Ax Tree changed"}),(0,j.jsx)(K.l,{id:"Listen-AX-Tree-change",testName:"Listen AX Tree change",checked:ew,setChecked:ef}),(0,j.jsxs)("div",{className:"text-header-s",children:["Count: ",null!=eE?eE:"0"]}),(0,j.jsx)(k.$n,{type:"secondary",onClick:eb,children:"Reset"})]}),(0,j.jsxs)("div",{className:"flex items-center gap-2",children:[Ay&&(0,j.jsxs)("div",{children:["AxTreeNodes: ",null==Ay?void 0:Ay.length]}),AI&&(0,j.jsxs)("div",{children:["FilteredNodes: ",null==AI?void 0:AI.length]}),AD&&(0,j.jsxs)("div",{children:["Orphans Nodes: ",null==AD?void 0:AD.length]})]}),(0,j.jsx)("div",{className:"flex border-b border-gray-300",children:eF.map(function(A){return(0,j.jsx)("button",{className:"px-4 py-2 text-sm font-medium ".concat(C===A.id?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"),onClick:function(){return I(A.id)},children:A.label},A.id)})}),"axTree"===C&&(0,j.jsxs)("div",{className:"flex w-full gap-2",children:[(0,j.jsx)("div",{className:"w-[60%] border-r pr-4",children:(0,j.jsx)("div",{className:"h-full max-h-[600px]",children:(0,j.jsx)("div",{className:"h-full overflow-y-auto",children:Ay&&(0,j.jsx)(X,{nodes:Ay})})})}),(0,j.jsx)("div",{className:"w-[40%] flex-col gap-2 pl-4",children:(0,j.jsx)("div",{className:"h-full max-h-[600px]",children:(0,j.jsxs)("div",{className:"h-full overflow-y-auto",children:[Ay&&(0,j.jsx)(L,{data:Ay,missingParentsIds:AM}),AI&&(0,j.jsx)(L,{data:AI,missingParentsIds:AM}),Af&&(0,j.jsx)($,{node:Af})]})})})]}),"tab"===C&&(0,j.jsx)(Ar,{tabId:m}),"textFetcher"===C&&B&&(0,j.jsx)(Ac,{groupId:B}),"hardware"===C&&(0,j.jsx)(Ap,{}),"gdocs"===C&&e$&&(0,j.jsx)(Aa,{tabId:m}),"gsheets"===C&&eL&&(0,j.jsx)(Ai,{tabId:m})]})},Ab=t(57693);let Af=function(){var A,e,t,r=function(){chrome.runtime.reload()},n=(A=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.abrupt("return",Promise.all([Ab.L$,Ab.Oy,Ab.KO].map(function(A){return caches.delete(A)})));case 1:case"end":return A.stop()}},A)})),function(){return A.apply(this,arguments)}),a=(e=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return localStorage.clear(),A.next=1,new Promise(function(A,e){chrome.storage.local.clear(function(){chrome.runtime.lastError?e(chrome.runtime.lastError):A(!0)})});case 1:return A.abrupt("return",A.sent);case 2:case"end":return A.stop()}},A)})),function(){return e.apply(this,arguments)}),o=(t=(0,E.A)(y().mark(function A(){return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=1,Promise.all([a(),n()]).then(function(){r()}).catch(function(){alert("Aria local data clear error")});case 1:case"end":return A.stop()}},A)})),function(){return t.apply(this,arguments)}),i=function(A){var e=A.type,t=A.url,r=A.prompt;return["chrome.runtime.sendMessage(\n      '".concat(chrome.runtime.id,"', {"),"\n	type: '".concat(e,"',\n"),t?"	url: ".concat(t,",\n"):"",r?'	prompt: "'.concat(r,'",\n'):"","})"].join("")},s=(0,f.useState)("Paste this message into startpage devtools)"),l=(0,b.A)(s,2),d=l[0],c=l[1];return(0,j.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,j.jsx)("h3",{className:"text-header-xl text-center",children:"Aria Devtools"}),(0,j.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("h4",{className:"text-header-m mb-2 text-center",children:"Storage"}),(0,j.jsxs)(k.$n,{type:"primary",onClick:function(){localStorage.debug?localStorage.removeItem("debug"):localStorage.debug=!0,r()},children:[localStorage.debug?"Disable":"Enable"," debug logging"]}),(0,j.jsx)(k.$n,{type:"primary",onClick:o,children:"Clear Aria local data"})]}),(0,j.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,j.jsx)("h4",{className:"text-header-m mb-2 text-center",children:"External messages"}),(0,j.jsxs)("div",{className:"grid grid-cols-3 gap-1",children:[(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return c(i({type:"client:sendPrompt",prompt:"hello from sidebar"}))},children:"RichHint send cli message"}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return c(i({type:Ab.pg.NEON_OPEN,prompt:"Welcome inside Neon Chat"}))},children:"Open Neon Chat"}),(0,j.jsx)(k.$n,{type:"primary",onClick:function(){return c(i({type:Ab.pg.NEON_OPEN_OPERATOR,prompt:"Play plemiona"}))},children:"Open Neon Do"})]}),(0,j.jsx)("textarea",{className:"mt-2 min-h-36 bg-color-neutral-92-60 p-2 text-color-text-01",value:d,onChange:function(A){return c(A.target.value)}})]})]})]})};var Aw=t(44125);let AE=function(A){var e=A.spinnerColoring,t=A.sizeClass,r=(0,V.sh)({grayAccent:"before:border-color-accent-50 before:border-t-color-neutral-88 after:border-color-neutral-88 after:border-t-color-accent-50",whiteGray:"before:border-color-neutral-88 before:border-t-transparent after:border-transparent after:border-t-color-neutral-88",operaAir:{grayAccent:"before:border-secondary-[#00000014] before:border-t-transparent after:border-transparent after:border-t-secondary-[#00000014]",whiteGray:"before:border-secondary-[#00000014] before:border-t-transparent after:border-transparent after:border-t-secondary-[#00000014]"}},["grayAccent","whiteGray"]),n=r.grayAccent,a=r.whiteGray;return(0,j.jsx)("span",{"data-testid":Aw.Y.LOADING_SPINNER_SPAN,className:(0,W.xW)(void 0===t?"h-4 w-4":t,"gray-accent"===e?n:a,"after:content relative inline-block before:absolute before:block before:h-full before:w-full before:animate-spin before:rounded-full before:border-2 before:border-solid before:content-[''] after:absolute after:block after:h-full after:w-full after:animate-spin after:rounded-full after:border-2 after:border-solid after:delay-150 after:content-['']")})};var Av=(Az=(0,E.A)(y().mark(function A(e){var t;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,opr.localMCPPrivate.listTools(e);case 1:return A.abrupt("return",A.sent);case 2:throw A.prev=2,console.info("listTools is not possible due to:",t=A.catch(0)),t;case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(A){return Az.apply(this,arguments)}),Ay=(AD=(0,E.A)(y().mark(function A(){var e;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,opr.localMCPPrivate.listServers();case 1:return A.abrupt("return",A.sent);case 2:throw A.prev=2,console.info("listServers is not possible due to:",e=A.catch(0)),e;case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(){return AD.apply(this,arguments)}),Ak=(AO=(0,E.A)(y().mark(function A(e,t,r){var n;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,opr.localMCPPrivate.callTool(e,t,r);case 1:return A.abrupt("return",A.sent);case 2:throw A.prev=2,console.info("callTool is not possible due to:",n=A.catch(0)),n;case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(A,e,t){return AO.apply(this,arguments)});function AC(A,e){var t=Object.keys(A);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(A);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(A,e).enumerable})),t.push.apply(t,r)}return t}function Aj(A){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?AC(Object(t),!0).forEach(function(e){(0,C.A)(A,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(A,Object.getOwnPropertyDescriptors(t)):AC(Object(t)).forEach(function(e){Object.defineProperty(A,e,Object.getOwnPropertyDescriptor(t,e))})}return A}var AI=function(A){var e,t=A.inputSchema,r=A.onSubmit,n=A.name,a=Object.fromEntries(Object.entries(t.properties).map(function(A){var e,t=(0,b.A)(A,2);return[t[0],null!=(e=t[1].default)?e:""]})),o=(0,f.useState)(a),i=(0,b.A)(o,2),s=i[0],l=i[1],d=(0,f.useState)({}),c=(0,b.A)(d,2),m=c[0],p=c[1],B=null!=(e=t.required)?e:[],g=function(A,e){l(function(t){return Aj(Aj({},t),{},(0,C.A)({},A,e))})},h=function(){var A={};return B.forEach(function(e){s[e]&&""!==s[e].toString().trim()||(A[e]="Required")}),p(A),0===Object.keys(A).length};return(0,j.jsxs)("form",{onSubmit:function(A){A.preventDefault(),h()&&r(n,s)},className:"grid max-w-lg grid-cols-2 gap-4",children:[Object.entries(t.properties).map(function(A){var e=(0,b.A)(A,2),t=e[0],r=e[1],n=B.includes(t);return(0,j.jsxs)("div",{className:"flex flex-col",children:[(0,j.jsxs)("label",{htmlFor:t,className:"mb-1 font-semibold text-gray-700",children:[t,n&&(0,j.jsx)("span",{className:"ml-1 text-red-500",children:"*"})]}),(0,j.jsx)("input",{type:(r.type,"text"),id:t,value:s[t],onChange:function(A){return g(t,A.target.value)},placeholder:r.description,className:"rounded border px-3 py-2 focus:outline-none focus:ring ".concat(m[t]?"border-red-500 focus:ring-red-300":"border-gray-300 focus:ring-blue-300")}),r.description&&(0,j.jsx)("small",{className:"mt-1 text-gray-500",children:r.description}),m[t]&&(0,j.jsx)("span",{className:"mt-1 text-sm text-red-500",children:m[t]})]},t)}),(0,j.jsx)("div",{className:"col-span-2",children:(0,j.jsx)("button",{type:"submit",className:"rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700",children:"Submit"})})]})};let AN=function(){var A,e,t,r=(0,f.useState)([]),n=(0,b.A)(r,2),a=n[0],o=n[1],i=(0,f.useState)(),s=(0,b.A)(i,2),l=s[0],d=s[1],c=(0,f.useState)(),m=(0,b.A)(c,2),p=m[0],B=m[1],g=(0,f.useState)(!1),h=(0,b.A)(g,2),x=h[0],u=h[1],v=(0,f.useRef)(null),k=(0,f.useState)(""),C=(0,b.A)(k,2),I=C[0],N=C[1],S=(A=(0,E.A)(y().mark(function A(){var e,t;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,Ay();case 1:(e=A.sent)&&d(e),o(function(A){return[].concat((0,w.A)(A),[{command:"listServers",result:JSON.stringify(e,null,2)}])}),A.next=3;break;case 2:A.prev=2,t=A.catch(0),o(function(A){return[].concat((0,w.A)(A),[{command:"listServers (error)",result:String(t)}])});case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(){return A.apply(this,arguments)}),z=(e=(0,E.A)(y().mark(function A(){var e,t;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,u(!0),A.next=1,Av(I);case 1:(e=A.sent)&&B(e[0]),o(function(A){return[].concat((0,w.A)(A),[{command:"listTools "+I,result:JSON.stringify(e,null,2)}])}),A.next=3;break;case 2:A.prev=2,t=A.catch(0),o(function(A){return[].concat((0,w.A)(A),[{command:"listTools (error) "+I,result:String(t)}])});case 3:return A.prev=3,u(!1),A.finish(3);case 4:case"end":return A.stop()}},A,null,[[0,2,3,4]])})),function(){return e.apply(this,arguments)}),D=(t=(0,E.A)(y().mark(function A(e,t){var r,n;return y().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=1,Ak(I,e,t);case 1:r=A.sent,o(function(A){return[].concat((0,w.A)(A),[{command:"callTool "+e,result:JSON.stringify(r,null,2)}])}),A.next=3;break;case 2:A.prev=2,n=A.catch(0),o(function(A){return[].concat((0,w.A)(A),[{command:"callTool (error) "+e,result:String(n)}])});case 3:case"end":return A.stop()}},A,null,[[0,2]])})),function(A,e){return t.apply(this,arguments)});return(0,f.useEffect)(function(){var A;null==(A=v.current)||A.scrollIntoView({behavior:"smooth"})},[a]),(0,j.jsxs)("div",{className:"flex h-full w-full flex-col",children:[(0,j.jsxs)("div",{className:"mb-2 flex min-h-12 flex-row gap-2",children:[(0,j.jsx)("div",{children:(0,j.jsx)("button",{className:"rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700",onClick:S,children:"Get Servers"})}),l&&(0,j.jsxs)("div",{className:"flex flex-col items-start gap-2",children:[(0,j.jsx)("select",{className:"w-40 rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",value:I,onChange:function(A){N(A.target.value)},children:l.map(function(A,e){return(0,j.jsx)("option",{value:A.name,children:A.name},e)})}),I&&(0,j.jsxs)("p",{children:["Selected: ",I]})]}),I&&(0,j.jsx)("button",{className:"rounded px-3 py-1 text-white ".concat(x?"cursor-not-allowed bg-gray-400":"bg-blue-600 hover:bg-blue-700"),onClick:z,disabled:x,children:"Get Tools"}),x&&(0,j.jsx)("div",{className:"flex items-center",children:(0,j.jsx)(AE,{sizeClass:"h-12 w-12"})})]}),p&&(0,j.jsx)("div",{className:"mb-2",children:(0,j.jsx)(AI,{inputSchema:p.inputschema,onSubmit:D,name:p.name})}),(0,j.jsxs)("div",{className:"w-full rounded bg-gray-800 p-4 shadow",children:[(0,j.jsx)("h2",{className:"mb-2 text-lg font-bold text-white",children:"Debug Console"}),(0,j.jsxs)("div",{className:"h-150 overflow-y-auto rounded bg-black p-3 font-mono text-xs text-green-300",style:{whiteSpace:"pre-wrap"},children:[0===a.length?(0,j.jsx)("span",{className:"text-gray-400",children:"No logs..."}):a.map(function(A,e){return(0,j.jsxs)("div",{children:[(0,j.jsxs)("span",{className:"text-yellow-300",children:["> ",A.command]}),"\n",A.result,"\n"]},e)}),(0,j.jsx)("div",{ref:v})]})]})]})};var AS=document.getElementById("root");if(document.body.parentNode&&AS){var Az,AD,AO,AT,AP=(0,x.createRoot)(AS);null!=(AT=chrome)&&null!=(AT=AT.devtools)&&AT.panels?chrome.devtools.panels.create("Aria Devtools","favicon_opera_one","devtools.html",function(A){return console.log("Aria devtools panel successfully created",A)}):console.log("Mounting Aria Operator devtools in non-devtools window"),AP.render((0,j.jsx)(u.b,{children:(0,j.jsx)(function(){var A,e,t=!!(null!=(A=opr)&&A.browserOperatorPrivate),r=!!(null!=(e=opr)&&e.localMCPPrivate),n=(0,f.useState)(t?"operator":"aria"),a=(0,b.A)(n,2),o=a[0],i=a[1],s=[{id:"aria",label:"Aria"},t&&{id:"operator",label:"Operator"},r&&{id:"localMcp",label:"Local MCP"}].filter(Boolean);return(0,j.jsxs)("div",{className:"h-full w-full",children:[(0,j.jsx)("div",{className:"flex border-b border-gray-300",children:s.map(function(A){return(0,j.jsx)("button",{className:"px-4 py-2 text-sm font-medium ".concat(o===A.id?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"),onClick:function(){return i(A.id)},children:A.label},A.id)})}),(0,j.jsxs)("div",{className:"p-4",children:["operator"===o&&(0,j.jsx)(N,{children:(0,j.jsx)(Au,{})}),"aria"===o&&(0,j.jsx)(Af,{}),"localMcp"===o&&(0,j.jsx)(AN,{})]})]})},{})}))}},77261(A,e,t){t.d(e,{LT:()=>s,Mx:()=>o,NE:()=>r,VQ:()=>a,kb:()=>n,yG:()=>i});var r=500,n=300,a="cubic-bezier(0.00, 0.00, 0.12, 1.00)",o="ease-out",i=1e4,s="reset-interactive-states"},61394(A,e,t){t.d(e,{D6:()=>r.D,Mk:()=>n.M,QC:()=>a.Q,sh:()=>o.s}),t(7234),t(64447),t(45738),t(39671),t(61458),t(5145);var r=t(15370);t(36190),t(97835);var n=t(29871);t(25700),t(13926),t(49348),t(29648),t(48323),t(1414),t(76593),t(31799),t(58717);var a=t(40023);t(16077);var o=t(47173);t(72333),t(11040),t(4918)},77136(A,e,t){t.d(e,{N4:()=>r.N4,hU:()=>r.hU,rz:()=>n.r});var r=t(33722);t(90224);var n=t(90540)},9503(A,e,t){t.d(e,{BF:()=>r.B,IU:()=>n.I});var r=t(18035),n=t(22724);t(34648),t(30923),t(96465),t(39782),t(31403),t(22819)},70468(A,e,t){t.d(e,{BF:()=>r.BF,IU:()=>r.IU,YE:()=>n.YE}),t(94600),t(88979);var r=t(9503),n=t(98302)},94810(A,e,t){t.d(e,{BFY:()=>r.BF,Bjx:()=>r.Bj,IU7:()=>r.px,V7e:()=>n.V7,YEi:()=>r.YE,b7R:()=>r.b7,jei:()=>a.jei,lyu:()=>a.lyu,rQr:()=>a.rQr,two:()=>r.tw});var r=t(89886),n=t(17877),a=t(72641);t(89085),t(75192),t(92924)},78878(A,e,t){t.d(e,{l:()=>a});var r=t(96540);t(57693),t(74848);var n=(0,r.createContext)(!1),a=function(){return(0,r.useContext)(n)}},29224(A,e,t){t.d(e,{A:()=>k});var r=t(71354),n=t.n(r),a=t(76314),o=t.n(a),i=t(74713),s=t(67385),l=t(78810),d=t(78685),c=t(27712),m=t(4417),p=t.n(m),B=new URL(t(94041),t.b),g=new URL(t(77005),t.b),h=new URL(t(35502),t.b),x=new URL(t(12526),t.b),u=new URL(t(19501),t.b),b=o()(n());b.i(i.A),b.i(s.A),b.i(l.A),b.i(d.A),b.i(c.A);var f=p()(B),w=p()(g),E=p()(h),v=p()(x),y=p()(u);b.push([A.id,`*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}/*
! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com
*//*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: Space Mono; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/
dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}
.\\!container {
  width: 100% !important;
}
.container {
  width: 100%;
}
@media (min-width: 640px) {

  .\\!container {
    max-width: 640px !important;
  }

  .container {
    max-width: 640px;
  }
}
@media (min-width: 751px) {

  .\\!container {
    max-width: 751px !important;
  }

  .container {
    max-width: 751px;
  }
}
@media (min-width: 800px) {

  .\\!container {
    max-width: 800px !important;
  }

  .container {
    max-width: 800px;
  }
}
@media (min-width: 1068px) {

  .\\!container {
    max-width: 1068px !important;
  }

  .container {
    max-width: 1068px;
  }
}
@media (min-width: 1280px) {

  .\\!container {
    max-width: 1280px !important;
  }

  .container {
    max-width: 1280px;
  }
}
@media (min-width: 1536px) {

  .\\!container {
    max-width: 1536px !important;
  }

  .container {
    max-width: 1536px;
  }
}
.tab-view.opera-one .bg-right-gradient::after {
    content: "";
    pointer-events: none;
    position: absolute;
    right: 0px;
    top: 0px;
    display: block;
    height: 100%;
    width: 35%;
    background-image: url(${f});
    background-repeat: no-repeat;
    --tw-blur: blur(90px);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
    background-position: 100% 50%;
    background-size: 90% 100%;
  }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.pointer-events-none {
  pointer-events: none;
}
.pointer-events-auto {
  pointer-events: auto;
}
.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
.collapse {
  visibility: collapse;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.\\!absolute {
  position: absolute !important;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.sticky {
  position: sticky;
}
.inset-0 {
  inset: 0px;
}
.inset-x-0 {
  left: 0px;
  right: 0px;
}
.inset-y-0 {
  top: 0px;
  bottom: 0px;
}
.\\!bottom-\\[36px\\] {
  bottom: 36px !important;
}
.-bottom-3 {
  bottom: -0.75rem;
}
.-bottom-6 {
  bottom: -1.5rem;
}
.-bottom-\\[3px\\] {
  bottom: -3px;
}
.-left-\\[207px\\] {
  left: -207px;
}
.-left-\\[25px\\] {
  left: -25px;
}
.-left-\\[3px\\] {
  left: -3px;
}
.-right-\\[3px\\] {
  right: -3px;
}
.-right-\\[5px\\] {
  right: -5px;
}
.-top-2 {
  top: -0.5rem;
}
.-top-24 {
  top: -6rem;
}
.-top-3 {
  top: -0.75rem;
}
.-top-\\[3px\\] {
  top: -3px;
}
.-top-\\[58px\\] {
  top: -58px;
}
.-top-\\[5px\\] {
  top: -5px;
}
.-top-aria-px {
  top: -1px;
}
.bottom-0 {
  bottom: 0px;
}
.bottom-\\[32px\\] {
  bottom: 32px;
}
.bottom-\\[4px\\] {
  bottom: 4px;
}
.bottom-\\[calc\\(100\\%\\+12px\\)\\] {
  bottom: calc(100% + 12px);
}
.bottom-full {
  bottom: 100%;
}
.left-0 {
  left: 0px;
}
.left-1\\/2 {
  left: 50%;
}
.left-2 {
  left: 0.5rem;
}
.left-6 {
  left: 1.5rem;
}
.left-9 {
  left: 2.25rem;
}
.left-\\[-3px\\] {
  left: -3px;
}
.left-\\[1\\.5px\\] {
  left: 1.5px;
}
.left-\\[3\\.5px\\] {
  left: 3.5px;
}
.left-\\[50\\%\\] {
  left: 50%;
}
.left-\\[calc\\(50\\%-14px\\)\\] {
  left: calc(50% - 14px);
}
.left-aria-6 {
  left: 24px;
}
.right-0 {
  right: 0px;
}
.right-2 {
  right: 0.5rem;
}
.right-2\\.5 {
  right: 0.625rem;
}
.right-3 {
  right: 0.75rem;
}
.right-4 {
  right: 1rem;
}
.right-\\[-26px\\] {
  right: -26px;
}
.right-\\[3px\\] {
  right: 3px;
}
.right-aria-6 {
  right: 24px;
}
.top-0 {
  top: 0px;
}
.top-1\\/2 {
  top: 50%;
}
.top-2 {
  top: 0.5rem;
}
.top-2\\.5 {
  top: 0.625rem;
}
.top-22 {
  top: 90px;
}
.top-3 {
  top: 0.75rem;
}
.top-4 {
  top: 1rem;
}
.top-\\[-14px\\] {
  top: -14px;
}
.top-\\[100vh\\] {
  top: 100vh;
}
.top-\\[calc\\(100\\%\\+12px\\)\\] {
  top: calc(100% + 12px);
}
.top-\\[calc\\(50\\%-14px\\)\\] {
  top: calc(50% - 14px);
}
.top-aria-4 {
  top: 12px;
}
.top-full {
  top: 100%;
}
.isolate {
  isolation: isolate;
}
.\\!z-\\[110\\] {
  z-index: 110 !important;
}
.z-0 {
  z-index: 0;
}
.z-1 {
  z-index: 1;
}
.z-10 {
  z-index: 10;
}
.z-11 {
  z-index: 11;
}
.z-2 {
  z-index: 2;
}
.z-20 {
  z-index: 20;
}
.z-30 {
  z-index: 30;
}
.z-50 {
  z-index: 50;
}
.z-\\[100\\] {
  z-index: 100;
}
.z-\\[101\\] {
  z-index: 101;
}
.z-\\[11\\] {
  z-index: 11;
}
.z-\\[12\\] {
  z-index: 12;
}
.z-\\[24\\] {
  z-index: 24;
}
.z-\\[2\\] {
  z-index: 2;
}
.z-\\[3\\] {
  z-index: 3;
}
.z-\\[4\\] {
  z-index: 4;
}
.z-\\[60\\] {
  z-index: 60;
}
.z-\\[6\\] {
  z-index: 6;
}
.z-\\[70\\] {
  z-index: 70;
}
.z-\\[7\\] {
  z-index: 7;
}
.z-\\[99\\] {
  z-index: 99;
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
.col-start-2 {
  grid-column-start: 2;
}
.row-span-2 {
  grid-row: span 2 / span 2;
}
.row-start-1 {
  grid-row-start: 1;
}
.-m-2 {
  margin: -0.5rem;
}
.m-0 {
  margin: 0px;
}
.m-1 {
  margin: 0.25rem;
}
.m-2 {
  margin: 0.5rem;
}
.m-aria-1 {
  margin: 2px;
}
.m-aria-2 {
  margin: 4px;
}
.m-auto {
  margin: auto;
}
.-mx-\\[10px\\] {
  margin-left: -10px;
  margin-right: -10px;
}
.-my-4 {
  margin-top: -1rem;
  margin-bottom: -1rem;
}
.-my-\\[1px\\] {
  margin-top: -1px;
  margin-bottom: -1px;
}
.mx-0 {
  margin-left: 0px;
  margin-right: 0px;
}
.mx-10 {
  margin-left: 2.5rem;
  margin-right: 2.5rem;
}
.mx-11 {
  margin-left: 2.75rem;
  margin-right: 2.75rem;
}
.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-5 {
  margin-left: 1.25rem;
  margin-right: 1.25rem;
}
.mx-6 {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}
.mx-7 {
  margin-left: 1.75rem;
  margin-right: 1.75rem;
}
.mx-8 {
  margin-left: 2rem;
  margin-right: 2rem;
}
.mx-9 {
  margin-left: 2.25rem;
  margin-right: 2.25rem;
}
.mx-aria-3 {
  margin-left: 8px;
  margin-right: 8px;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-0 {
  margin-top: 0px;
  margin-bottom: 0px;
}
.my-1 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
.my-2 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.my-\\[1em\\] {
  margin-top: 1em;
  margin-bottom: 1em;
}
.my-\\[24px\\] {
  margin-top: 24px;
  margin-bottom: 24px;
}
.my-aria-1 {
  margin-top: 2px;
  margin-bottom: 2px;
}
.my-aria-2 {
  margin-top: 4px;
  margin-bottom: 4px;
}
.my-aria-3 {
  margin-top: 8px;
  margin-bottom: 8px;
}
.my-aria-4 {
  margin-top: 12px;
  margin-bottom: 12px;
}
.my-aria-5 {
  margin-top: 16px;
  margin-bottom: 16px;
}
.my-aria-6 {
  margin-top: 24px;
  margin-bottom: 24px;
}
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
.-mb-\\[14px\\] {
  margin-bottom: -14px;
}
.-ml-2 {
  margin-left: -0.5rem;
}
.-ml-\\[2px\\] {
  margin-left: -2px;
}
.-mr-0\\.5 {
  margin-right: -0.125rem;
}
.-mr-1 {
  margin-right: -0.25rem;
}
.-mr-2 {
  margin-right: -0.5rem;
}
.-mr-3 {
  margin-right: -0.75rem;
}
.-mr-\\[14px\\] {
  margin-right: -14px;
}
.-mr-\\[2px\\] {
  margin-right: -2px;
}
.-mr-aria-4 {
  margin-right: -12px;
}
.-mt-2 {
  margin-top: -0.5rem;
}
.-mt-aria-2 {
  margin-top: -4px;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-5 {
  margin-bottom: 1.25rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.mb-aria-1 {
  margin-bottom: 2px;
}
.mb-aria-2 {
  margin-bottom: 4px;
}
.mb-aria-3 {
  margin-bottom: 8px;
}
.mb-aria-4 {
  margin-bottom: 12px;
}
.mb-aria-5 {
  margin-bottom: 16px;
}
.mb-aria-6 {
  margin-bottom: 24px;
}
.mb-aria-7 {
  margin-bottom: 32px;
}
.mb-auto {
  margin-bottom: auto;
}
.ml-0\\.5 {
  margin-left: 0.125rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.ml-1\\.5 {
  margin-left: 0.375rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.ml-4 {
  margin-left: 1rem;
}
.ml-6 {
  margin-left: 1.5rem;
}
.ml-aria-1 {
  margin-left: 2px;
}
.ml-aria-3 {
  margin-left: 8px;
}
.ml-auto {
  margin-left: auto;
}
.mr-1 {
  margin-right: 0.25rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-4 {
  margin-right: 1rem;
}
.mr-\\[1px\\] {
  margin-right: 1px;
}
.mr-aria-1 {
  margin-right: 2px;
}
.mr-aria-3 {
  margin-right: 8px;
}
.mt-0\\.5 {
  margin-top: 0.125rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-1\\.5 {
  margin-top: 0.375rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mt-60 {
  margin-top: 15rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mt-\\[0\\.5px\\] {
  margin-top: 0.5px;
}
.mt-\\[1px\\] {
  margin-top: 1px;
}
.mt-\\[6px\\] {
  margin-top: 6px;
}
.mt-aria-2 {
  margin-top: 4px;
}
.mt-aria-3 {
  margin-top: 8px;
}
.mt-aria-4 {
  margin-top: 12px;
}
.mt-aria-5 {
  margin-top: 16px;
}
.mt-aria-6 {
  margin-top: 24px;
}
.mt-auto {
  margin-top: auto;
}
.box-border {
  box-sizing: border-box;
}
.box-content {
  box-sizing: content-box;
}
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.\\!block {
  display: block !important;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.\\!inline {
  display: inline !important;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.table {
  display: table;
}
.grid {
  display: grid;
}
.contents {
  display: contents;
}
.hidden {
  display: none;
}
.aspect-\\[3\\/4\\] {
  aspect-ratio: 3/4;
}
.size-\\[100px\\] {
  width: 100px;
  height: 100px;
}
.size-\\[140px\\] {
  width: 140px;
  height: 140px;
}
.size-\\[25px\\] {
  width: 25px;
  height: 25px;
}
.size-\\[5px\\] {
  width: 5px;
  height: 5px;
}
.size-full {
  width: 100%;
  height: 100%;
}
.\\!h-10 {
  height: 2.5rem !important;
}
.\\!h-8 {
  height: 2rem !important;
}
.\\!h-\\[25px\\] {
  height: 25px !important;
}
.h-0 {
  height: 0px;
}
.h-0\\.5 {
  height: 0.125rem;
}
.h-1 {
  height: 0.25rem;
}
.h-10 {
  height: 2.5rem;
}
.h-12 {
  height: 3rem;
}
.h-14 {
  height: 3.5rem;
}
.h-150 {
  height: 600px;
}
.h-16 {
  height: 4rem;
}
.h-2 {
  height: 0.5rem;
}
.h-20 {
  height: 5rem;
}
.h-29 {
  height: 114px;
}
.h-3 {
  height: 0.75rem;
}
.h-3\\.5 {
  height: 0.875rem;
}
.h-4 {
  height: 1rem;
}
.h-5 {
  height: 1.25rem;
}
.h-5\\.5 {
  height: 22px;
}
.h-6 {
  height: 1.5rem;
}
.h-7 {
  height: 1.75rem;
}
.h-8 {
  height: 2rem;
}
.h-9 {
  height: 2.25rem;
}
.h-9\\.5 {
  height: 38px;
}
.h-96 {
  height: 24rem;
}
.h-\\[110px\\] {
  height: 110px;
}
.h-\\[122px\\] {
  height: 122px;
}
.h-\\[125px\\] {
  height: 125px;
}
.h-\\[128px\\] {
  height: 128px;
}
.h-\\[164px\\] {
  height: 164px;
}
.h-\\[17px\\] {
  height: 17px;
}
.h-\\[210px\\] {
  height: 210px;
}
.h-\\[21px\\] {
  height: 21px;
}
.h-\\[25px\\] {
  height: 25px;
}
.h-\\[29px\\] {
  height: 29px;
}
.h-\\[2px\\] {
  height: 2px;
}
.h-\\[30vh\\] {
  height: 30vh;
}
.h-\\[348px\\] {
  height: 348px;
}
.h-\\[36px\\] {
  height: 36px;
}
.h-\\[42px\\] {
  height: 42px;
}
.h-\\[51px\\] {
  height: 51px;
}
.h-\\[57px\\] {
  height: 57px;
}
.h-\\[60px\\] {
  height: 60px;
}
.h-\\[68px\\] {
  height: 68px;
}
.h-\\[6px\\] {
  height: 6px;
}
.h-\\[calc\\(100\\%-8px\\)\\] {
  height: calc(100% - 8px);
}
.h-\\[stretch\\] {
  height: -webkit-fill-available;
  height: -moz-available;
  height: stretch;
}
.h-aria-11 {
  height: 80px;
}
.h-aria-5 {
  height: 16px;
}
.h-aria-6 {
  height: 24px;
}
.h-aria-7 {
  height: 32px;
}
.h-aria-8 {
  height: 40px;
}
.h-aria-9 {
  height: 48px;
}
.h-aria-px {
  height: 1px;
}
.h-auto {
  height: auto;
}
.h-full {
  height: 100%;
}
.h-px {
  height: 1px;
}
.h-screen {
  height: 100vh;
}
.max-h-4 {
  max-height: 1rem;
}
.max-h-44 {
  max-height: 11rem;
}
.max-h-6 {
  max-height: 1.5rem;
}
.max-h-60 {
  max-height: 15rem;
}
.max-h-70 {
  max-height: 280px;
}
.max-h-\\[100px\\] {
  max-height: 100px;
}
.max-h-\\[150px\\] {
  max-height: 150px;
}
.max-h-\\[173px\\] {
  max-height: 173px;
}
.max-h-\\[193px\\] {
  max-height: 193px;
}
.max-h-\\[250px\\] {
  max-height: 250px;
}
.max-h-\\[280px\\] {
  max-height: 280px;
}
.max-h-\\[394px\\] {
  max-height: 394px;
}
.max-h-\\[400px\\] {
  max-height: 400px;
}
.max-h-\\[600px\\] {
  max-height: 600px;
}
.max-h-\\[75\\%\\] {
  max-height: 75%;
}
.max-h-\\[calc\\(100\\%-2rem\\)\\] {
  max-height: calc(100% - 2rem);
}
.max-h-\\[calc\\(100vh-32px\\)\\] {
  max-height: calc(100vh - 32px);
}
.max-h-\\[min\\(768px\\2c 85vh\\)\\] {
  max-height: min(768px, 85vh);
}
.max-h-\\[min\\(calc\\(100vh-120px\\)\\2c 320px\\)\\] {
  max-height: min(calc(100vh - 120px), 320px);
}
.max-h-full {
  max-height: 100%;
}
.min-h-0 {
  min-height: 0px;
}
.min-h-10 {
  min-height: 2.5rem;
}
.min-h-12 {
  min-height: 3rem;
}
.min-h-14 {
  min-height: 3.5rem;
}
.min-h-3 {
  min-height: 0.75rem;
}
.min-h-36 {
  min-height: 9rem;
}
.min-h-6 {
  min-height: 1.5rem;
}
.min-h-7 {
  min-height: 1.75rem;
}
.min-h-\\[200px\\] {
  min-height: 200px;
}
.min-h-\\[280px\\] {
  min-height: 280px;
}
.min-h-\\[320px\\] {
  min-height: 320px;
}
.min-h-\\[36px\\] {
  min-height: 36px;
}
.min-h-\\[80px\\] {
  min-height: 80px;
}
.min-h-fit {
  min-height: -moz-fit-content;
  min-height: fit-content;
}
.min-h-screen {
  min-height: 100vh;
}
.\\!w-8 {
  width: 2rem !important;
}
.\\!w-\\[25px\\] {
  width: 25px !important;
}
.w-1 {
  width: 0.25rem;
}
.w-10 {
  width: 2.5rem;
}
.w-10\\/12 {
  width: 83.333333%;
}
.w-12 {
  width: 3rem;
}
.w-2 {
  width: 0.5rem;
}
.w-24 {
  width: 6rem;
}
.w-29 {
  width: 114px;
}
.w-3 {
  width: 0.75rem;
}
.w-3\\.5 {
  width: 0.875rem;
}
.w-30 {
  width: 120px;
}
.w-32 {
  width: 8rem;
}
.w-4 {
  width: 1rem;
}
.w-40 {
  width: 10rem;
}
.w-5 {
  width: 1.25rem;
}
.w-6 {
  width: 1.5rem;
}
.w-64 {
  width: 16rem;
}
.w-7 {
  width: 1.75rem;
}
.w-72 {
  width: 18rem;
}
.w-8 {
  width: 2rem;
}
.w-93 {
  width: 372px;
}
.w-\\[0px\\] {
  width: 0px;
}
.w-\\[110px\\] {
  width: 110px;
}
.w-\\[117px\\] {
  width: 117px;
}
.w-\\[120\\%\\] {
  width: 120%;
}
.w-\\[164px\\] {
  width: 164px;
}
.w-\\[174px\\] {
  width: 174px;
}
.w-\\[176px\\] {
  width: 176px;
}
.w-\\[178px\\] {
  width: 178px;
}
.w-\\[17px\\] {
  width: 17px;
}
.w-\\[1px\\] {
  width: 1px;
}
.w-\\[200px\\] {
  width: 200px;
}
.w-\\[256px\\] {
  width: 256px;
}
.w-\\[25px\\] {
  width: 25px;
}
.w-\\[270px\\] {
  width: 270px;
}
.w-\\[30px\\] {
  width: 30px;
}
.w-\\[344px\\] {
  width: 344px;
}
.w-\\[40\\%\\] {
  width: 40%;
}
.w-\\[480px\\] {
  width: 480px;
}
.w-\\[48px\\] {
  width: 48px;
}
.w-\\[51px\\] {
  width: 51px;
}
.w-\\[56px\\] {
  width: 56px;
}
.w-\\[60\\%\\] {
  width: 60%;
}
.w-\\[600px\\] {
  width: 600px;
}
.w-\\[640px\\] {
  width: 640px;
}
.w-\\[6px\\] {
  width: 6px;
}
.w-\\[808px\\] {
  width: 808px;
}
.w-\\[stretch\\] {
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
}
.w-aria-6 {
  width: 24px;
}
.w-aria-7 {
  width: 32px;
}
.w-aria-8 {
  width: 40px;
}
.w-aria-9 {
  width: 48px;
}
.w-fit {
  width: -moz-fit-content;
  width: fit-content;
}
.w-full {
  width: 100%;
}
.w-max {
  width: -moz-max-content;
  width: max-content;
}
.w-screen {
  width: 100vw;
}
.min-w-0 {
  min-width: 0px;
}
.min-w-10 {
  min-width: 2.5rem;
}
.min-w-12 {
  min-width: 3rem;
}
.min-w-16 {
  min-width: 4rem;
}
.min-w-20 {
  min-width: 5rem;
}
.min-w-36 {
  min-width: 9rem;
}
.min-w-4 {
  min-width: 1rem;
}
.min-w-64 {
  min-width: 16rem;
}
.min-w-80 {
  min-width: 20rem;
}
.min-w-96 {
  min-width: 24rem;
}
.min-w-\\[110px\\] {
  min-width: 110px;
}
.min-w-\\[120px\\] {
  min-width: 120px;
}
.min-w-\\[148px\\] {
  min-width: 148px;
}
.min-w-\\[320px\\] {
  min-width: 320px;
}
.min-w-\\[3rem\\] {
  min-width: 3rem;
}
.min-w-\\[500px\\] {
  min-width: 500px;
}
.min-w-\\[51px\\] {
  min-width: 51px;
}
.min-w-\\[60px\\] {
  min-width: 60px;
}
.min-w-\\[72px\\] {
  min-width: 72px;
}
.\\!max-w-\\[calc\\(100\\%-24px\\)\\] {
  max-width: calc(100% - 24px) !important;
}
.max-w-16 {
  max-width: 4rem;
}
.max-w-22 {
  max-width: 94px;
}
.max-w-24 {
  max-width: 6rem;
}
.max-w-28 {
  max-width: 7rem;
}
.max-w-2xl {
  max-width: 42rem;
}
.max-w-3xl {
  max-width: 48rem;
}
.max-w-4xl {
  max-width: 56rem;
}
.max-w-96 {
  max-width: 24rem;
}
.max-w-\\[1200px\\] {
  max-width: 1200px;
}
.max-w-\\[170px\\] {
  max-width: 170px;
}
.max-w-\\[200px\\] {
  max-width: 200px;
}
.max-w-\\[272px\\] {
  max-width: 272px;
}
.max-w-\\[291px\\] {
  max-width: 291px;
}
.max-w-\\[30\\%\\] {
  max-width: 30%;
}
.max-w-\\[341px\\] {
  max-width: 341px;
}
.max-w-\\[375px\\] {
  max-width: 375px;
}
.max-w-\\[376px\\] {
  max-width: 376px;
}
.max-w-\\[396px\\] {
  max-width: 396px;
}
.max-w-\\[450px\\] {
  max-width: 450px;
}
.max-w-\\[45px\\] {
  max-width: 45px;
}
.max-w-\\[460px\\] {
  max-width: 460px;
}
.max-w-\\[600px\\] {
  max-width: 600px;
}
.max-w-\\[760px\\] {
  max-width: 760px;
}
.max-w-\\[80\\%\\] {
  max-width: 80%;
}
.max-w-\\[98vw\\] {
  max-width: 98vw;
}
.max-w-\\[calc\\(100\\%-2rem\\)\\] {
  max-width: calc(100% - 2rem);
}
.max-w-full {
  max-width: 100%;
}
.max-w-lg {
  max-width: 32rem;
}
.max-w-md {
  max-width: 28rem;
}
.max-w-none {
  max-width: none;
}
.max-w-tab-view {
  max-width: 768px;
}
.max-w-xl {
  max-width: 36rem;
}
.flex-1 {
  flex: 1 0 0;
}
.flex-auto {
  flex: 1 1 auto;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.shrink-0 {
  flex-shrink: 0;
}
.flex-grow {
  flex-grow: 1;
}
.flex-grow-0 {
  flex-grow: 0;
}
.grow {
  flex-grow: 1;
}
.grow-0 {
  flex-grow: 0;
}
.basis-64 {
  flex-basis: 16rem;
}
.border-collapse {
  border-collapse: collapse;
}
.border-separate {
  border-collapse: separate;
}
.border-spacing-\\[0px\\] {
  --tw-border-spacing-x: 0px;
  --tw-border-spacing-y: 0px;
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}
.-translate-x-1\\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-1\\/2 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-\\[5\\%\\] {
  --tw-translate-y: -5%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-0\\.5 {
  --tw-translate-x: 0.125rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-1 {
  --tw-translate-x: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-\\[-50\\%\\] {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-\\[16px\\] {
  --tw-translate-x: 16px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-\\[22px\\] {
  --tw-translate-x: 22px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-y-0 {
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-y-full {
  --tw-translate-y: 100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-rotate-45 {
  --tw-rotate: -45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-rotate-90 {
  --tw-rotate: -90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-0 {
  --tw-rotate: 0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-180 {
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-45 {
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-90 {
  --tw-rotate: 90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-\\[135deg\\] {
  --tw-rotate: 135deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-\\[225deg\\] {
  --tw-rotate: 225deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-50 {
  --tw-scale-x: .5;
  --tw-scale-y: .5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-scale-x-100 {
  --tw-scale-x: -1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes blurOut {

  0% {
    opacity: 1;
    filter: blur(0px);
  }

  100% {
    opacity: 0;
    filter: blur(8px);
  }
}
.animate-blur-out {
  animation: blurOut 0.3s ease-out forwards;
}
@keyframes fade {

  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
.animate-fade {
  animation: fade var(--tw-animate-duration, 1s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, 1) var(--tw-animate-fill, both);
}
@keyframes growIn {

  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-grow-in {
  animation: growIn 0.4s ease-out forwards;
}
@keyframes imageHolderShimmer {

  0% {
    background-position: -300px 0;
  }

  100% {
    background-position: 300px 0;
  }
}
.animate-imageHolderShimmerNew {
  animation: imageHolderShimmer 10s linear infinite forwards;
}
@keyframes pulse {

  50% {
    opacity: .5;
  }
}
.animate-pulse {
  animation: pulse var(--tw-animate-duration, 2s) var(--tw-animate-easing, cubic-bezier(0.4, 0, 0.6, 1)) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite) var(--tw-animate-fill, none);
}
.animate-scale-in {
  animation: scale-in 0.2s forwards;
}
@keyframes spin {

  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin var(--tw-animate-duration, 1s) var(--tw-animate-easing, linear) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite) var(--tw-animate-fill, none);
}
@keyframes waveWelcomeOnce {

  0% {
    background-position: 200% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}
.animate-waveWelcomeOnce {
  animation: waveWelcomeOnce 2s ease-in-out forwards;
}
.\\!cursor-pointer {
  cursor: pointer !important;
}
.cursor-default {
  cursor: default;
}
.cursor-help {
  cursor: help;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-zoom-in {
  cursor: zoom-in;
}
.cursor-zoom-out {
  cursor: zoom-out;
}
.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize-none {
  resize: none;
}
.resize-y {
  resize: vertical;
}
.resize {
  resize: both;
}
.list-inside {
  list-style-position: inside;
}
.list-decimal {
  list-style-type: decimal;
}
.list-disc {
  list-style-type: disc;
}
.list-none {
  list-style-type: none;
}
.appearance-none {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}
.auto-rows-min {
  grid-auto-rows: min-content;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-\\[repeat\\(auto-fill\\2c minmax\\(max\\(160px\\2c calc\\(\\(100\\%-1rem\\)\\/3\\)\\)\\2c 1fr\\)\\)\\] {
  grid-template-columns: repeat(auto-fill,minmax(max(160px, calc((100% - 1rem) / 3)),1fr));
}
.grid-rows-\\[0fr\\] {
  grid-template-rows: 0fr;
}
.grid-rows-\\[1fr\\] {
  grid-template-rows: 1fr;
}
.grid-rows-\\[auto_auto\\] {
  grid-template-rows: auto auto;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.place-items-center {
  place-items: center;
}
.items-start {
  align-items: flex-start;
}
.items-end {
  align-items: flex-end;
}
.items-center {
  align-items: center;
}
.items-baseline {
  align-items: baseline;
}
.\\!justify-start {
  justify-content: flex-start !important;
}
.justify-start {
  justify-content: flex-start;
}
.justify-end {
  justify-content: flex-end;
}
.\\!justify-center {
  justify-content: center !important;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.justify-around {
  justify-content: space-around;
}
.gap-0\\.5 {
  gap: 0.125rem;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-1\\.5 {
  gap: 0.375rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-2\\.5 {
  gap: 0.625rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}
.gap-\\[2px\\] {
  gap: 2px;
}
.gap-\\[4px\\] {
  gap: 4px;
}
.gap-\\[6px\\] {
  gap: 6px;
}
.gap-aria-1 {
  gap: 2px;
}
.gap-aria-2 {
  gap: 4px;
}
.gap-aria-2\\.5 {
  gap: 6px;
}
.gap-aria-3 {
  gap: 8px;
}
.gap-aria-4 {
  gap: 12px;
}
.gap-aria-5 {
  gap: 16px;
}
.gap-aria-6 {
  gap: 24px;
}
.gap-x-1\\.5 {
  -moz-column-gap: 0.375rem;
       column-gap: 0.375rem;
}
.gap-x-aria-2 {
  -moz-column-gap: 4px;
       column-gap: 4px;
}
.gap-x-aria-3 {
  -moz-column-gap: 8px;
       column-gap: 8px;
}
.gap-x-aria-4 {
  -moz-column-gap: 12px;
       column-gap: 12px;
}
.gap-x-aria-7 {
  -moz-column-gap: 32px;
       column-gap: 32px;
}
.gap-y-aria-1 {
  row-gap: 2px;
}
.gap-y-aria-2 {
  row-gap: 4px;
}
.gap-y-aria-3 {
  row-gap: 8px;
}
.gap-y-aria-4 {
  row-gap: 12px;
}
.space-y-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0px * var(--tw-space-y-reverse));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-aria-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(8px * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(8px * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.self-start {
  align-self: flex-start;
}
.self-center {
  align-self: center;
}
.self-stretch {
  align-self: stretch;
}
.justify-self-end {
  justify-self: end;
}
.overflow-auto {
  overflow: auto;
}
.\\!overflow-hidden {
  overflow: hidden !important;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-clip {
  overflow: clip;
}
.overflow-x-auto {
  overflow-x: auto;
}
.overflow-y-auto {
  overflow-y: auto;
}
.overflow-x-hidden {
  overflow-x: hidden;
}
.overflow-y-hidden {
  overflow-y: hidden;
}
.overflow-y-scroll {
  overflow-y: scroll;
}
.overscroll-contain {
  overscroll-behavior: contain;
}
.overscroll-none {
  overscroll-behavior: none;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.overflow-ellipsis {
  text-overflow: ellipsis;
}
.text-ellipsis {
  text-overflow: ellipsis;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.whitespace-break-spaces {
  white-space: break-spaces;
}
.text-nowrap {
  text-wrap: nowrap;
}
.break-words {
  overflow-wrap: break-word;
}
.break-all {
  word-break: break-all;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-2xl {
  border-radius: 1rem;
}
.rounded-\\[10px\\] {
  border-radius: 10px;
}
.rounded-\\[12px\\] {
  border-radius: 12px;
}
.rounded-\\[24px\\] {
  border-radius: 24px;
}
.rounded-\\[2px\\] {
  border-radius: 2px;
}
.rounded-\\[3px\\] {
  border-radius: 3px;
}
.rounded-\\[4px\\] {
  border-radius: 4px;
}
.rounded-\\[6px\\] {
  border-radius: 6px;
}
.rounded-\\[8px\\] {
  border-radius: 8px;
}
.rounded-\\[var\\(--opera-button-border-radius\\)\\] {
  border-radius: var(--opera-button-border-radius);
}
.rounded-aria-radius-1 {
  border-radius: var(--radius-1);
}
.rounded-aria-radius-2 {
  border-radius: var(--radius-2);
}
.rounded-aria-radius-3 {
  border-radius: var(--radius-3);
}
.rounded-aria-radius-4 {
  border-radius: var(--radius-4);
}
.rounded-aria-radius-5 {
  border-radius: var(--radius-5);
}
.rounded-aria-radius-6 {
  border-radius: var(--radius-6);
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.rounded-sm {
  border-radius: 0.125rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-b-aria-radius-3 {
  border-bottom-right-radius: var(--radius-3);
  border-bottom-left-radius: var(--radius-3);
}
.rounded-b-lg {
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.rounded-l-aria-radius-3 {
  border-top-left-radius: var(--radius-3);
  border-bottom-left-radius: var(--radius-3);
}
.rounded-r-aria-radius-3 {
  border-top-right-radius: var(--radius-3);
  border-bottom-right-radius: var(--radius-3);
}
.rounded-t-\\[8px\\] {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.rounded-t-aria-radius-3 {
  border-top-left-radius: var(--radius-3);
  border-top-right-radius: var(--radius-3);
}
.rounded-t-lg {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
.rounded-bl-aria-radius-2 {
  border-bottom-left-radius: var(--radius-2);
}
.rounded-br-aria-radius-2 {
  border-bottom-right-radius: var(--radius-2);
}
.rounded-tl-aria-radius-2 {
  border-top-left-radius: var(--radius-2);
}
.rounded-tr-aria-radius-2 {
  border-top-right-radius: var(--radius-2);
}
.\\!border-0 {
  border-width: 0px !important;
}
.border {
  border-width: 1px;
}
.border-0 {
  border-width: 0px;
}
.border-2 {
  border-width: 2px;
}
.border-4 {
  border-width: 4px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-b-0 {
  border-bottom-width: 0px;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.border-r {
  border-right-width: 1px;
}
.border-t {
  border-top-width: 1px;
}
.border-solid {
  border-style: solid;
}
.border-none {
  border-style: none;
}
.border-black {
  --tw-border-opacity: 1;
  border-color: rgb(0 0 0 / var(--tw-border-opacity, 1));
}
.border-blue-400 {
  --tw-border-opacity: 1;
  border-color: rgb(96 165 250 / var(--tw-border-opacity, 1));
}
.border-blue-500 {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}
.border-blue-500\\/30 {
  border-color: rgb(59 130 246 / 0.3);
}
.border-color-accent-50 {
  border-color: var(--color-accent-50);
}
.border-color-neutral-76 {
  border-color: var(--color-neutral-76);
}
.border-color-neutral-88 {
  border-color: var(--color-neutral-88);
}
.border-color-neutral-90 {
  border-color: var(--color-neutral-90);
}
.border-color-neutral-93 {
  border-color: var(--color-neutral-93);
}
.border-color-neutral-95 {
  border-color: var(--color-neutral-95);
}
.border-color-neutral-98 {
  border-color: var(--color-neutral-98);
}
.border-color-state-error {
  border-color: var(--color-state-error);
}
.border-color-text-02 {
  border-color: var(--color-text-02);
}
.border-color-text-04 {
  border-color: var(--color-text-04);
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
}
.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}
.border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-transparent {
  border-color: transparent;
}
.border-b-color-neutral-92 {
  border-bottom-color: var(--color-neutral-92);
}
.border-r-color-neutral-88 {
  border-right-color: var(--color-neutral-88);
}
.border-t-color-neutral-92 {
  border-top-color: var(--color-neutral-92);
}
.border-t-color-text-00 {
  border-top-color: var(--color-text-00);
}
.border-t-transparent {
  border-top-color: transparent;
}
.\\!bg-black\\/\\[0\\.08\\] {
  background-color: rgb(0 0 0 / 0.08) !important;
}
.\\!bg-color-neutral-92-60 {
  background-color: var(--color-neutral-92-60) !important;
}
.\\!bg-color-neutral-93 {
  background-color: var(--color-neutral-93) !important;
}
.bg-\\[\\#121315\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(18 19 21 / var(--tw-bg-opacity, 1));
}
.bg-\\[\\#2A2E32\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(42 46 50 / var(--tw-bg-opacity, 1));
}
.bg-\\[\\#707585\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(112 117 133 / var(--tw-bg-opacity, 1));
}
.bg-\\[\\#C4C4C4\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(196 196 196 / var(--tw-bg-opacity, 1));
}
.bg-\\[\\#ECEDEF\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(236 237 239 / var(--tw-bg-opacity, 1));
}
.bg-\\[--bg-toggle-switch-on-hover\\] {
  background-color: var(--bg-toggle-switch-on-hover);
}
.bg-\\[--opera-confirmation-popup-background\\] {
  background-color: var(--opera-confirmation-popup-background);
}
.bg-\\[color-mix\\(in_srgb\\2c var\\(--color-state-error\\)_10\\%\\2c transparent\\)\\] {
  background-color: color-mix(in srgb,var(--color-state-error) 10%,transparent);
}
.bg-\\[var\\(--opera-chatbot-blockquote-bg\\)\\] {
  background-color: var(--opera-chatbot-blockquote-bg);
}
.bg-\\[var\\(--search-tooltip-background\\)\\] {
  background-color: var(--search-tooltip-background);
}
.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));
}
.bg-black\\/20 {
  background-color: rgb(0 0 0 / 0.2);
}
.bg-black\\/\\[0\\.06\\] {
  background-color: rgb(0 0 0 / 0.06);
}
.bg-blue-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}
.bg-blue-500\\/20 {
  background-color: rgb(59 130 246 / 0.2);
}
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}
.bg-buttons-primary-bg {
  background-color: var(--color-buttons-primary-bg);
}
.bg-color-accent-0 {
  background-color: var(--color-accent-0);
}
.bg-color-accent-100 {
  background-color: var(--color-accent-100);
}
.bg-color-accent-20 {
  background-color: var(--color-accent-20);
}
.bg-color-accent-24 {
  background-color: var(--color-accent-24);
}
.bg-color-accent-25 {
  background-color: var(--color-accent-25);
}
.bg-color-accent-30 {
  background-color: var(--color-accent-30);
}
.bg-color-accent-40 {
  background-color: var(--color-accent-40);
}
.bg-color-accent-45 {
  background-color: var(--color-accent-45);
}
.bg-color-accent-50 {
  background-color: var(--color-accent-50);
}
.bg-color-accent-60 {
  background-color: var(--color-accent-60);
}
.bg-color-accent-80 {
  background-color: var(--color-accent-80);
}
.bg-color-accent-95 {
  background-color: var(--color-accent-95);
}
.bg-color-level-0 {
  background-color: var(--color-level-0);
}
.bg-color-level-1 {
  background-color: var(--color-level-1);
}
.bg-color-level-1-1 {
  background-color: var(--color-level-1-1);
}
.bg-color-level-2 {
  background-color: var(--color-level-2);
}
.bg-color-level-3 {
  background-color: var(--color-level-3);
}
.bg-color-level-4 {
  background-color: var(--color-level-4);
}
.bg-color-level-5 {
  background-color: var(--color-level-5);
}
.bg-color-level-6 {
  background-color: var(--color-level-6);
}
.bg-color-neutral-100 {
  background-color: var(--color-neutral-100);
}
.bg-color-neutral-76 {
  background-color: var(--color-neutral-76);
}
.bg-color-neutral-88 {
  background-color: var(--color-neutral-88);
}
.bg-color-neutral-90 {
  background-color: var(--color-neutral-90);
}
.bg-color-neutral-92 {
  background-color: var(--color-neutral-92);
}
.bg-color-neutral-92-40 {
  background-color: var(--color-neutral-92-40);
}
.bg-color-neutral-92-60 {
  background-color: var(--color-neutral-92-60);
}
.bg-color-neutral-93 {
  background-color: var(--color-neutral-93);
}
.bg-color-neutral-95 {
  background-color: var(--color-neutral-95);
}
.bg-color-neutral-98 {
  background-color: var(--color-neutral-98);
}
.bg-color-other-o2 {
  background-color: var(--color-other-o2);
}
.bg-color-state-correct {
  background-color: var(--color-state-correct);
}
.bg-color-state-error {
  background-color: var(--color-state-error);
}
.bg-color-state-error-bg {
  background-color: var(--color-state-error-bg);
}
.bg-color-tabs-c2 {
  background-color: var(--color-tabs-c2);
}
.bg-color-tabs-c5 {
  background-color: var(--color-tabs-c5);
}
.bg-color-text-00 {
  background-color: var(--color-text-00);
}
.bg-color-text-01 {
  background-color: var(--color-text-01);
}
.bg-color-text-02 {
  background-color: var(--color-text-02);
}
.bg-color-text-03 {
  background-color: var(--color-text-03);
}
.bg-color-text-04 {
  background-color: var(--color-text-04);
}
.bg-color-text-05 {
  background-color: var(--color-text-05);
}
.bg-current {
  background-color: currentColor;
}
.bg-cyan-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(236 254 255 / var(--tw-bg-opacity, 1));
}
.bg-extra-content-bg {
  background-color: var(--color-extra-content-bg);
}
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-gray-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
}
.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.bg-gray-700\\/50 {
  background-color: rgb(55 65 81 / 0.5);
}
.bg-gray-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}
.bg-gray-800\\/50 {
  background-color: rgb(31 41 55 / 0.5);
}
.bg-gray-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-indigo-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));
}
.bg-purple-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));
}
.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-500\\/10 {
  background-color: rgb(239 68 68 / 0.1);
}
.bg-transparent {
  background-color: transparent;
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-opacity-90 {
  --tw-bg-opacity: 0.9;
}
.bg-opacity-95 {
  --tw-bg-opacity: 0.95;
}
.bg-\\[linear-gradient\\(110deg\\2c var\\(--color-text-03\\)\\2c 35\\%\\2c var\\(--color-text-00\\)\\2c 50\\%\\2c var\\(--color-text-03\\)\\2c 75\\%\\2c var\\(--color-text-03\\)\\)\\] {
  background-image: linear-gradient(110deg,var(--color-text-03),35%,var(--color-text-00),50%,var(--color-text-03),75%,var(--color-text-03));
}
.bg-\\[linear-gradient\\(180deg\\2c _rgba\\(18\\2c 19\\2c 21\\2c 0\\.00\\)_16\\.67\\%\\2c _\\#0e0f11_100\\%\\)\\] {
  background-image: linear-gradient(180deg, rgba(18,19,21,0.00) 16.67%, #0e0f11 100%);
}
.bg-\\[linear-gradient\\(180deg\\2c _rgba\\(255\\2c 255\\2c 255\\2c 0\\.00\\)_16\\.67\\%\\2c _\\#FFF_100\\%\\)\\] {
  background-image: linear-gradient(180deg, rgba(255,255,255,0.00) 16.67%, #FFF 100%);
}
.bg-\\[linear-gradient\\(90deg\\2c \\#56a2ef_0\\%\\2c \\#72a1f3_8\\.17\\%\\2c \\#be9eff_55\\.77\\%\\2c \\#8585c1_100\\%\\)\\] {
  background-image: linear-gradient(90deg,#56a2ef 0%,#72a1f3 8.17%,#be9eff 55.77%,#8585c1 100%);
}
.bg-\\[repeating-linear-gradient\\(to_right\\2c theme\\(colors\\.color-text-03\\)_0\\2c theme\\(colors\\.color-text-03\\)_1px\\2c transparent_1px\\2c transparent_2px\\)\\] {
  background-image: repeating-linear-gradient(to right,var(--color-text-03) 0,var(--color-text-03) 1px,transparent 1px,transparent 2px);
}
.bg-background-login {
  background-image: linear-gradient(90deg, rgb(192 157 148 / 0.2) 6.25%, rgb(108 108 178 / 0.2) 36.06%, rgb(146 149 232 / 0.2) 58.17%, rgb(158 182 255 / 0.2) 80.77%, rgb(123 181 247 / 0.2) 96.63%);;
}
.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}
.bg-gradient-to-l {
  background-image: linear-gradient(to left, var(--tw-gradient-stops));
}
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
.bg-gradient-to-t {
  background-image: linear-gradient(to top, var(--tw-gradient-stops));
}
.bg-image-viewer-thumbnail-gradient {
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%);
}
.bg-shimmer-new {
  background-image: linear-gradient(to right, light-dark(#DEE1E3,#2A2E32) 0%, light-dark(white,#636B74) 50%, light-dark(#DEE1E3,#2A2E32) 100%);
}
.bg-welcome-text {
  background-image: var(--welcome-text-background);
}
.from-color-level-2 {
  --tw-gradient-from: var(--color-level-2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-color-level-5 {
  --tw-gradient-from: var(--color-level-5) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-transparent {
  --tw-gradient-from: transparent var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-\\[var\\(--color-neutral-95\\)\\] {
  --tw-gradient-to: var(--color-neutral-95) var(--tw-gradient-to-position);
}
.to-transparent {
  --tw-gradient-to: transparent var(--tw-gradient-to-position);
}
.bg-\\[length\\:100\\%_1px\\] {
  background-size: 100% 1px;
}
.bg-\\[length\\:200\\%_100\\%\\] {
  background-size: 200% 100%;
}
.bg-\\[length\\:400\\%_200\\%\\] {
  background-size: 400% 200%;
}
.bg-cover {
  background-size: cover;
}
.bg-clip-text {
  -webkit-background-clip: text;
          background-clip: text;
}
.bg-\\[position\\:0_calc\\(100\\%\\+0px\\)\\] {
  background-position: 0 calc(100% + 0px);
}
.bg-center {
  background-position: center;
}
.bg-no-repeat {
  background-repeat: no-repeat;
}
.fill-\\[--aria-bg-shape-fill-color\\] {
  fill: var(--aria-bg-shape-fill-color);
}
.fill-\\[--aria-bg-shape-shadow-color\\] {
  fill: var(--aria-bg-shape-shadow-color);
}
.fill-\\[--color-neutral-88\\] {
  fill: var(--color-neutral-88);
}
.object-contain {
  -o-object-fit: contain;
     object-fit: contain;
}
.object-cover {
  -o-object-fit: cover;
     object-fit: cover;
}
.object-center {
  -o-object-position: center;
     object-position: center;
}
.\\!p-0 {
  padding: 0px !important;
}
.p-0 {
  padding: 0px;
}
.p-0\\.5 {
  padding: 0.125rem;
}
.p-1 {
  padding: 0.25rem;
}
.p-1\\.5 {
  padding: 6px;
}
.p-2 {
  padding: 0.5rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
.p-5 {
  padding: 1.25rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-8 {
  padding: 2rem;
}
.p-\\[12px\\] {
  padding: 12px;
}
.p-\\[2px\\] {
  padding: 2px;
}
.p-\\[7\\.5px\\] {
  padding: 7.5px;
}
.p-aria-2 {
  padding: 4px;
}
.p-aria-3 {
  padding: 8px;
}
.p-aria-4 {
  padding: 12px;
}
.p-aria-5 {
  padding: 16px;
}
.p-aria-6 {
  padding: 24px;
}
.\\!px-2 {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
.\\!px-aria-4 {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
.px-0 {
  padding-left: 0px;
  padding-right: 0px;
}
.px-0\\.5 {
  padding-left: 0.125rem;
  padding-right: 0.125rem;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-1\\.5 {
  padding-left: 6px;
  padding-right: 6px;
}
.px-12 {
  padding-left: 3rem;
  padding-right: 3rem;
}
.px-16 {
  padding-left: 4rem;
  padding-right: 4rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.px-\\[10px\\] {
  padding-left: 10px;
  padding-right: 10px;
}
.px-\\[5px\\] {
  padding-left: 5px;
  padding-right: 5px;
}
.px-aria-1 {
  padding-left: 2px;
  padding-right: 2px;
}
.px-aria-12 {
  padding-left: 96px;
  padding-right: 96px;
}
.px-aria-2 {
  padding-left: 4px;
  padding-right: 4px;
}
.px-aria-3 {
  padding-left: 8px;
  padding-right: 8px;
}
.px-aria-4 {
  padding-left: 12px;
  padding-right: 12px;
}
.px-aria-5 {
  padding-left: 16px;
  padding-right: 16px;
}
.px-aria-6 {
  padding-left: 24px;
  padding-right: 24px;
}
.py-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}
.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-0\\.75 {
  padding-top: 3px;
  padding-bottom: 3px;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5 {
  padding-top: 6px;
  padding-bottom: 6px;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.py-\\[2px\\] {
  padding-top: 2px;
  padding-bottom: 2px;
}
.py-\\[9\\.5px\\] {
  padding-top: 9.5px;
  padding-bottom: 9.5px;
}
.py-aria-1 {
  padding-top: 2px;
  padding-bottom: 2px;
}
.py-aria-2 {
  padding-top: 4px;
  padding-bottom: 4px;
}
.py-aria-2\\.5 {
  padding-top: 6px;
  padding-bottom: 6px;
}
.py-aria-3 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.py-aria-4 {
  padding-top: 12px;
  padding-bottom: 12px;
}
.py-aria-5 {
  padding-top: 16px;
  padding-bottom: 16px;
}
.\\!pl-0 {
  padding-left: 0px !important;
}
.pb-0 {
  padding-bottom: 0px;
}
.pb-1 {
  padding-bottom: 0.25rem;
}
.pb-1\\.5 {
  padding-bottom: 6px;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.pb-3 {
  padding-bottom: 0.75rem;
}
.pb-4 {
  padding-bottom: 1rem;
}
.pb-\\[14px\\] {
  padding-bottom: 14px;
}
.pb-\\[28px\\] {
  padding-bottom: 28px;
}
.pb-\\[2px\\] {
  padding-bottom: 2px;
}
.pb-aria-1 {
  padding-bottom: 2px;
}
.pb-aria-2\\.5 {
  padding-bottom: 6px;
}
.pb-aria-3 {
  padding-bottom: 8px;
}
.pb-aria-4 {
  padding-bottom: 12px;
}
.pb-aria-5 {
  padding-bottom: 16px;
}
.pb-aria-6 {
  padding-bottom: 24px;
}
.pb-aria-7 {
  padding-bottom: 32px;
}
.pb-aria-9 {
  padding-bottom: 48px;
}
.pl-1 {
  padding-left: 0.25rem;
}
.pl-1\\.5 {
  padding-left: 6px;
}
.pl-2 {
  padding-left: 0.5rem;
}
.pl-4 {
  padding-left: 1rem;
}
.pl-5 {
  padding-left: 1.25rem;
}
.pl-\\[14px\\] {
  padding-left: 14px;
}
.pl-\\[18px\\] {
  padding-left: 18px;
}
.pl-\\[37px\\] {
  padding-left: 37px;
}
.pl-\\[56\\.5px\\] {
  padding-left: 56.5px;
}
.pl-aria-2 {
  padding-left: 4px;
}
.pl-aria-2\\.5 {
  padding-left: 6px;
}
.pl-aria-4 {
  padding-left: 12px;
}
.pr-0\\.5 {
  padding-right: 0.125rem;
}
.pr-1 {
  padding-right: 0.25rem;
}
.pr-1\\.5 {
  padding-right: 6px;
}
.pr-2 {
  padding-right: 0.5rem;
}
.pr-2\\.5 {
  padding-right: 0.625rem;
}
.pr-3 {
  padding-right: 0.75rem;
}
.pr-3\\.5 {
  padding-right: 0.875rem;
}
.pr-4 {
  padding-right: 1rem;
}
.pr-5 {
  padding-right: 1.25rem;
}
.pr-\\[22\\.5px\\] {
  padding-right: 22.5px;
}
.pr-aria-2 {
  padding-right: 4px;
}
.pr-aria-3 {
  padding-right: 8px;
}
.pr-aria-4 {
  padding-right: 12px;
}
.pr-aria-7 {
  padding-right: 32px;
}
.pt-0 {
  padding-top: 0px;
}
.pt-0\\.5 {
  padding-top: 0.125rem;
}
.pt-1 {
  padding-top: 0.25rem;
}
.pt-1\\.25 {
  padding-top: 5px;
}
.pt-12 {
  padding-top: 3rem;
}
.pt-2 {
  padding-top: 0.5rem;
}
.pt-3 {
  padding-top: 0.75rem;
}
.pt-4 {
  padding-top: 1rem;
}
.pt-5 {
  padding-top: 1.25rem;
}
.pt-8 {
  padding-top: 2rem;
}
.pt-\\[2px\\] {
  padding-top: 2px;
}
.pt-aria-2 {
  padding-top: 4px;
}
.pt-aria-2\\.5 {
  padding-top: 6px;
}
.pt-aria-4 {
  padding-top: 12px;
}
.pt-aria-5 {
  padding-top: 16px;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-start {
  text-align: start;
}
.text-end {
  text-align: end;
}
.align-baseline {
  vertical-align: baseline;
}
.align-middle {
  vertical-align: middle;
}
.font-mono {
  font-family: Space Mono;
}
.\\!text-\\[14px\\] {
  font-size: 14px !important;
}
.\\!text-xxxs {
  font-size: 8px !important;
  line-height: 10px !important;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-\\[10px\\] {
  font-size: 10px;
}
.text-\\[12px\\] {
  font-size: 12px;
}
.text-\\[14px\\] {
  font-size: 14px;
}
.text-\\[16px\\] {
  font-size: 16px;
}
.text-\\[26px\\] {
  font-size: 26px;
}
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 12px;
  line-height: 17px;
}
.text-xxs {
  font-size: 10px;
  line-height: 12px;
}
.\\!font-\\[500\\] {
  font-weight: 500 !important;
}
.\\!font-black {
  font-weight: 900 !important;
}
.\\!font-bold {
  font-weight: 700 !important;
}
.\\!font-semibold {
  font-weight: 600 !important;
}
.font-bold {
  font-weight: 700;
}
.font-medium {
  font-weight: 500;
}
.font-normal {
  font-weight: 400;
}
.font-semibold {
  font-weight: 600;
}
.\\!uppercase {
  text-transform: uppercase !important;
}
.uppercase {
  text-transform: uppercase;
}
.lowercase {
  text-transform: lowercase;
}
.\\!capitalize {
  text-transform: capitalize !important;
}
.capitalize {
  text-transform: capitalize;
}
.\\!normal-case {
  text-transform: none !important;
}
.normal-case {
  text-transform: none;
}
.italic {
  font-style: italic;
}
.ordinal {
  --tw-ordinal: ordinal;
  font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction);
}
.\\!leading-\\[25px\\] {
  line-height: 25px !important;
}
.leading-5 {
  line-height: 1.25rem;
}
.leading-\\[1\\.4\\] {
  line-height: 1.4;
}
.leading-\\[24px\\] {
  line-height: 24px;
}
.leading-\\[normal\\] {
  line-height: normal;
}
.leading-none {
  line-height: 1;
}
.leading-normal {
  line-height: 1.5;
}
.leading-relaxed {
  line-height: 1.625;
}
.\\!text-blue-400 {
  --tw-text-opacity: 1 !important;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1)) !important;
}
.\\!text-color-state-error {
  color: var(--color-state-error) !important;
}
.text-\\[\\#171a1c\\] {
  --tw-text-opacity: 1;
  color: rgb(23 26 28 / var(--tw-text-opacity, 1));
}
.text-\\[\\#868f98\\] {
  --tw-text-opacity: 1;
  color: rgb(134 143 152 / var(--tw-text-opacity, 1));
}
.text-\\[\\#FF7A1A\\] {
  --tw-text-opacity: 1;
  color: rgb(255 122 26 / var(--tw-text-opacity, 1));
}
.text-\\[\\#dee0e3\\] {
  --tw-text-opacity: 1;
  color: rgb(222 224 227 / var(--tw-text-opacity, 1));
}
.text-\\[\\#f65164\\] {
  --tw-text-opacity: 1;
  color: rgb(246 81 100 / var(--tw-text-opacity, 1));
}
.text-\\[--opera-gx-font-color\\] {
  color: var(--opera-gx-font-color);
}
.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
}
.text-blue-300 {
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.text-blue-400 {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1));
}
.text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.text-blue-800 {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
}
.text-color-state-error {
  color: var(--color-state-error);
}
.text-color-text-00 {
  color: var(--color-text-00);
}
.text-color-text-01 {
  color: var(--color-text-01);
}
.text-color-text-02 {
  color: var(--color-text-02);
}
.text-color-text-03 {
  color: var(--color-text-03);
}
.text-color-text-04 {
  color: var(--color-text-04);
}
.text-color-text-05 {
  color: var(--color-text-05);
}
.text-color-text-a {
  color: var(--color-text-a);
}
.text-color-text-b {
  color: var(--color-text-b);
}
.text-color-text-e {
  color: var(--color-text-e);
}
.text-cyan-600 {
  --tw-text-opacity: 1;
  color: rgb(8 145 178 / var(--tw-text-opacity, 1));
}
.text-cyan-800 {
  --tw-text-opacity: 1;
  color: rgb(21 94 117 / var(--tw-text-opacity, 1));
}
.text-gray-100 {
  --tw-text-opacity: 1;
  color: rgb(243 244 246 / var(--tw-text-opacity, 1));
}
.text-gray-200 {
  --tw-text-opacity: 1;
  color: rgb(229 231 235 / var(--tw-text-opacity, 1));
}
.text-gray-300 {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
}
.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}
.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-gray-800 {
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity, 1));
}
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
}
.text-green-300 {
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}
.text-green-800 {
  --tw-text-opacity: 1;
  color: rgb(22 101 52 / var(--tw-text-opacity, 1));
}
.text-indigo-800 {
  --tw-text-opacity: 1;
  color: rgb(55 48 163 / var(--tw-text-opacity, 1));
}
.text-inherit {
  color: inherit;
}
.text-purple-800 {
  --tw-text-opacity: 1;
  color: rgb(107 33 168 / var(--tw-text-opacity, 1));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-700 {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}
.text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}
.text-transparent {
  color: transparent;
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-yellow-300 {
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.text-yellow-800 {
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
}
.underline {
  text-decoration-line: underline;
}
.line-through {
  text-decoration-line: line-through;
}
.no-underline {
  text-decoration-line: none;
}
.underline-offset-1 {
  text-underline-offset: 1px;
}
.underline-offset-2 {
  text-underline-offset: 2px;
}
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
.opacity-20 {
  opacity: 0.2;
}
.opacity-40 {
  opacity: 0.4;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-60 {
  opacity: 0.6;
}
.opacity-80 {
  opacity: 0.8;
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-2xl {
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-\\[0_4px_16px_-6px_rgba\\(23\\2c 26\\2c 28\\2c 0\\.08\\)\\] {
  --tw-shadow: 0 4px 16px -6px rgba(23,26,28,0.08);
  --tw-shadow-colored: 0 4px 16px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-\\[0px_0px_14px_0px_rgba\\(46\\2c 46\\2c 46\\2c 0\\.1\\)\\] {
  --tw-shadow: 0px 0px 14px 0px rgba(46,46,46,0.1);
  --tw-shadow-colored: 0px 0px 14px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-\\[0px_2px_4px_0px_rgba\\(23\\2c 26\\2c 28\\2c 0\\.2\\)\\] {
  --tw-shadow: 0px 2px 4px 0px rgba(23,26,28,0.2);
  --tw-shadow-colored: 0px 2px 4px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-\\[0px_6px_16px_0px_rgba\\(23\\2c 26\\2c 28\\2c 0\\.12\\)\\] {
  --tw-shadow: 0px 6px 16px 0px rgba(23,26,28,0.12);
  --tw-shadow-colored: 0px 6px 16px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-\\[0px_8px_22px_0px_rgba\\(23\\2c 26\\2c 28\\2c 0\\.18\\)\\] {
  --tw-shadow: 0px 8px 22px 0px rgba(23,26,28,0.18);
  --tw-shadow-colored: 0px 8px 22px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-aria-light-s {
  --tw-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.09);
  --tw-shadow-colored: 0 2px 12px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.\\!outline {
  outline-style: solid !important;
}
.outline {
  outline-style: solid;
}
.\\!outline-2 {
  outline-width: 2px !important;
}
.outline-2 {
  outline-width: 2px;
}
.\\!outline-offset-1 {
  outline-offset: 1px !important;
}
.\\!outline-color-accent-50 {
  outline-color: var(--color-accent-50) !important;
}
.\\!ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
}
.ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.brightness-100 {
  --tw-brightness: brightness(1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.drop-shadow-lg {
  --tw-drop-shadow: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.drop-shadow-xl {
  --tw-drop-shadow: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-blur-\\[4px\\] {
  --tw-backdrop-blur: blur(4px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-blur-\\[9px\\] {
  --tw-backdrop-blur: blur(9px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-blur-md {
  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[background-color\\] {
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[color\\2c box-shadow\\] {
  transition-property: color,box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[flex-grow\\] {
  transition-property: flex-grow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[grid-template-rows\\] {
  transition-property: grid-template-rows;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[left\\] {
  transition-property: left;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[max-height\\] {
  transition-property: max-height;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-\\[transform\\2c opacity\\] {
  transition-property: transform,opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.delay-\\[100ms\\] {
  transition-delay: 100ms;
}
.duration-100 {
  transition-duration: 100ms;
}
.duration-150 {
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.duration-500 {
  transition-duration: 500ms;
}
.duration-75 {
  transition-duration: 75ms;
}
.duration-\\[0\\.75s\\] {
  transition-duration: 0.75s;
}
.duration-\\[133ms\\] {
  transition-duration: 133ms;
}
.duration-\\[400ms\\] {
  transition-duration: 400ms;
}
.ease-\\[cubic-bezier\\(0\\.42\\2c 0\\2c 0\\.58\\2c 1\\)\\] {
  transition-timing-function: cubic-bezier(0.42,0,0.58,1);
}
.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-linear {
  transition-timing-function: linear;
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.\\@container {
  container-type: inline-size;
}
.\\@container\\/card-header {
  container-type: inline-size;
  container-name: card-header;
}
/**
   * Typography
   */
.text-header-xxl {
    font-family: var(--header-xxl-font-family);
    font-size: var(--header-xxl-font-size);
    font-style: var(--header-xxl-font-style);
    font-weight: var(--header-xxl-font-weight);
    line-height: var(--header-xxl-line-height);
    text-transform: var(--header-xxl-text-transform);
  }
.text-header-xl {
    font-family: var(--header-xl-font-family);
    font-size: var(--header-xl-font-size);
    font-style: var(--header-xl-font-style);
    font-weight: var(--header-xl-font-weight);
    line-height: var(--header-xl-line-height);
    text-transform: var(--header-xl-text-transform);
  }
.text-header-l {
    font-family: var(--header-l-font-family);
    font-size: var(--header-l-font-size);
    font-style: var(--header-l-font-style);
    font-weight: var(--header-l-font-weight);
    line-height: var(--header-l-line-height);
    text-transform: var(--header-l-text-transform);
  }
.text-header-m {
    font-family: var(--header-m-font-family);
    font-size: var(--header-m-font-size);
    font-style: var(--header-m-font-style);
    font-weight: var(--header-m-font-weight);
    line-height: var(--header-m-line-height);
    text-transform: var(--header-m-text-transform);
  }
.\\!text-header-s {
    font-family: var(--header-s-font-family) !important;
    font-size: var(--header-s-font-size) !important;
    font-style: var(--header-s-font-style) !important;
    font-weight: var(--header-s-font-weight) !important;
    line-height: var(--header-s-line-height) !important;
    text-transform: var(--header-s-text-transform) !important;
  }
.text-header-s {
    font-family: var(--header-s-font-family);
    font-size: var(--header-s-font-size);
    font-style: var(--header-s-font-style);
    font-weight: var(--header-s-font-weight);
    line-height: var(--header-s-line-height);
    text-transform: var(--header-s-text-transform);
  }
.text-subheader-l {
    font-family: var(--sub-header-l-font-family);
    font-size: var(--sub-header-l-font-size);
    font-style: var(--sub-header-l-font-style);
    font-weight: var(--sub-header-l-font-weight);
    line-height: var(--sub-header-l-line-height);
    text-transform: var(--sub-header-l-text-transform);
  }
.text-subheader-m {
    font-family: var(--sub-header-m-font-family);
    font-size: var(--sub-header-m-font-size);
    font-style: var(--sub-header-m-font-style);
    font-weight: var(--sub-header-m-font-weight);
    line-height: var(--sub-header-m-line-height);
    text-transform: var(--sub-header-m-text-transform);
  }
.text-subheader-s {
    font-family: var(--sub-header-s-font-family);
    font-size: var(--sub-header-s-font-size);
    font-style: var(--sub-header-s-font-style);
    font-weight: var(--sub-header-s-font-weight);
    line-height: var(--sub-header-s-line-height);
    text-transform: var(--sub-header-s-text-transform);
  }
.response-header-1,
  .response-header-2 {
    margin: 20px 0 12px;
  }
.response-header-3 {
    margin: 16px 0 12px;
  }
.response-header-4,
  .response-header-5,
  .response-header-6 {
    margin: 16px 0 8px;
  }
.response-header-2 > strong {
    font-weight: 700;
  }
.\\!message li > strong {
    font-weight: 600 !important;
  }
.message li > strong {
    font-weight: 600;
  }
.response-header-1,
  .response-header-2 {
    font-family: var(--header-l-font-family);
    font-size: var(--header-l-font-size);
    font-style: var(--header-l-font-style);
    font-weight: var(--header-l-font-weight);
    line-height: var(--header-l-line-height);
    text-transform: var(--header-l-text-transform);
  }
.response-header-3 {
    font-family: var(--header-m-font-family);
    font-size: var(--header-m-font-size);
    font-style: var(--header-m-font-style);
    font-weight: var(--header-m-font-weight);
    line-height: var(--header-m-line-height);
    text-transform: var(--header-m-text-transform);
  }
.response-header-4,
  .response-header-5,
  .response-header-6 {
    font-family: var(--header-s-font-family);
    font-size: var(--header-s-font-size);
    font-style: var(--header-s-font-style);
    font-weight: var(--header-s-font-weight);
    line-height: var(--header-s-line-height);
    text-transform: var(--header-s-text-transform);
  }
.text-body-l {
    font-family: var(--body-l-font-family);
    font-size: var(--body-l-font-size);
    font-style: var(--body-l-font-style);
    font-weight: var(--body-l-font-weight);
    line-height: var(--body-l-line-height);
    text-transform: var(--body-l-text-transform);
  }
.\\!text-body-m {
    font-family: var(--body-m-font-family) !important;
    font-size: var(--body-m-font-size) !important;
    font-style: var(--body-m-font-style) !important;
    font-weight: var(--body-m-font-weight) !important;
    line-height: var(--body-m-line-height) !important;
    text-transform: var(--body-m-text-transform) !important;
  }
.text-body-m {
    font-family: var(--body-m-font-family);
    font-size: var(--body-m-font-size);
    font-style: var(--body-m-font-style);
    font-weight: var(--body-m-font-weight);
    line-height: var(--body-m-line-height);
    text-transform: var(--body-m-text-transform);
  }
.text-body-s {
    font-family: var(--body-s-font-family);
    font-size: var(--body-s-font-size);
    font-style: var(--body-s-font-style);
    font-weight: var(--body-s-font-weight);
    line-height: var(--body-s-line-height);
    text-transform: var(--body-s-text-transform);
  }
.text-body-xs {
    font-family: var(--body-xs-font-family);
    font-size: var(--body-xs-font-size);
    font-style: var(--body-xs-font-style);
    font-weight: var(--body-xs-font-weight);
    line-height: var(--body-xs-line-height);
    text-transform: var(--body-xs-text-transform);
  }
.\\!text-button-l {
    font-family: var(--button-l-font-family) !important;
    font-size: var(--button-l-font-size) !important;
    font-style: var(--button-l-font-style) !important;
    font-weight: var(--button-l-font-weight) !important;
    line-height: var(--button-l-line-height) !important;
    text-transform: var(--button-l-text-transform) !important;
  }
.text-button-l {
    font-family: var(--button-l-font-family);
    font-size: var(--button-l-font-size);
    font-style: var(--button-l-font-style);
    font-weight: var(--button-l-font-weight);
    line-height: var(--button-l-line-height);
    text-transform: var(--button-l-text-transform);
  }
.text-button-m {
    font-family: var(--button-m-font-family);
    font-size: var(--button-m-font-size);
    font-style: var(--button-m-font-style);
    font-weight: var(--button-m-font-weight);
    line-height: var(--button-m-line-height);
    text-transform: var(--button-m-text-transform);
  }
.text-button-s {
    font-family: var(--button-s-font-family);
    font-size: var(--button-s-font-size);
    font-style: var(--button-s-font-style);
    font-weight: var(--button-s-font-weight);
    line-height: var(--button-s-line-height);
    text-transform: var(--button-s-text-transform);
  }
/**
   * General mask properties
   */
/**
   * Specific asset mask
   */
/**
   * Scrollbar hiding utilities
   */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
.chat-scroll::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
.chat-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
.chat-scroll::-webkit-scrollbar-thumb {
    background-color: var(--color-neutral-93);
    border-radius: 4px;
  }
.chat-scroll::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-neutral-88);
  }
.\\[-webkit-text-fill-color\\:transparent\\] {
  -webkit-text-fill-color: transparent;
}
.\\[background-clip\\:text\\] {
  -webkit-background-clip: text;
          background-clip: text;
}
.\\[listOpenedTabs\\:negative\\] {
  list-opened-tabs: negative;
}
.\\[outline-color\\:\\#1877d7\\] {
  outline-color: #1877d7;
}
.\\[outline-offset\\:-2px\\] {
  outline-offset: -2px;
}
.\\[scrollbar-gutter\\:stable\\] {
  scrollbar-gutter: stable;
}
@font-face {
  font-family: "Space Mono";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url(${w}) format("truetype");
}
@font-face {
  font-family: "Space Mono";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(${E}) format("truetype");
}
@keyframes inputJump {
  0% {
    transform: scale(100%);
  }
  50% {
    transform: scale(96%);
  }
  100% {
    transform: scale(100%);
  }
}
@keyframes inputDustOpacityStart {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
}
@keyframes inputDustOpacityEnd {
  0% {
    opacity: 100%;
  }
  100% {
    opacity: 0;
  }
}
@keyframes inputDustScaleUp {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
@keyframes inputSidebarDustScaleUp {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes scale-in {
  0% {
    opacity: 0;
    transform-origin: top left;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform-origin: top left;
    transform: scale(1);
  }
}
@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes typing {
  from {
    max-width: 0;
  }
  to {
    max-width: 100%;
  }
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
.mask-chevron-left {
  -webkit-mask-image: url(${v});
}
.mask-chevron-right {
  -webkit-mask-image: url(${y});
}
/* Border images */
.border-image-1-header {
  -o-border-image: var(--border-image-1-header);
     border-image: var(--border-image-1-header);
}
.markdown-table tr td,
.markdown-table tr th {
  border-right: 1px solid var(--color-level-0);
}
.markdown-table tbody tr td,
.markdown-table tbody tr th {
  border-top: 1px solid var(--color-level-0);
}
.markdown-table tr td:last-child,
.markdown-table tr th:last-child {
  border-right: none;
}
.code-box {
  border-color: var(--color-neutral-90);
}
.markdown-table tr td,
.markdown-table tr th {
  border-right: none;
  background: none;
}
.markdown-table tbody tr td,
.markdown-table tbody tr th {
  border-top: 1px solid var(--color-neutral-90);
}
.markdown-table tr td:last-child,
.markdown-table tr th:last-child {
  border-right: none;
}
/* 'anywhere' is not supported by current Tailwind version, so utility css class has been created */
.break-anywhere {
  overflow-wrap: anywhere;
}
/* other vars */
:root {
  -webkit-font-smoothing: antialiased;
  --opera-chatbot-blockquote-bg: transparent;
  --default-scrollbar-width: 6px;
}
body {
  border-radius: 4px 4px 0px 0px;
  margin: 0;
  padding: 0;
}
.\\[\\&\\>li\\]\\:custom-bullet>li {
  position: relative;
}
.\\[\\&\\>li\\]\\:custom-bullet>li::before {
  display: block;
  height: 5px;
  width: 5px;
  border-radius: 9999px;
  position: absolute;
  left: -13px;
  top: 0.625rem;
  background-color: currentColor;
  --tw-content: '';
  content: var(--tw-content);
}
.\\[\\&\\>li\\]\\:custom-bullet>li:where([dir="rtl"], [dir="rtl"] *)::before {
  content: var(--tw-content);
  right: -13px;
}
.first-letter\\:uppercase::first-letter {
  text-transform: uppercase;
}
.first-letter\\:capitalize::first-letter {
  text-transform: capitalize;
}
.file\\:inline-flex::file-selector-button {
  display: inline-flex;
}
.file\\:h-7::file-selector-button {
  height: 1.75rem;
}
.file\\:border-0::file-selector-button {
  border-width: 0px;
}
.file\\:bg-transparent::file-selector-button {
  background-color: transparent;
}
.file\\:text-sm::file-selector-button {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.file\\:font-medium::file-selector-button {
  font-weight: 500;
}
.placeholder\\:text-color-text-03::-moz-placeholder {
  color: var(--color-text-03);
}
.placeholder\\:text-color-text-03::placeholder {
  color: var(--color-text-03);
}
.backdrop\\:bg-black\\/50::backdrop {
  background-color: rgb(0 0 0 / 0.5);
}
.backdrop\\:backdrop-blur-sm::backdrop {
  --tw-backdrop-blur: blur(4px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.before\\:absolute::before {
  content: var(--tw-content);
  position: absolute;
}
.before\\:block::before {
  content: var(--tw-content);
  display: block;
}
.before\\:h-full::before {
  content: var(--tw-content);
  height: 100%;
}
.before\\:w-full::before {
  content: var(--tw-content);
  width: 100%;
}
@keyframes spin {

  to {
    content: var(--tw-content);
    transform: rotate(360deg);
  }
}
.before\\:animate-spin::before {
  content: var(--tw-content);
  animation: spin var(--tw-animate-duration, 1s) var(--tw-animate-easing, linear) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite) var(--tw-animate-fill, none);
}
.before\\:rounded-full::before {
  content: var(--tw-content);
  border-radius: 9999px;
}
.before\\:border-2::before {
  content: var(--tw-content);
  border-width: 2px;
}
.before\\:border-solid::before {
  content: var(--tw-content);
  border-style: solid;
}
.before\\:border-color-accent-50::before {
  content: var(--tw-content);
  border-color: var(--color-accent-50);
}
.before\\:border-color-neutral-88::before {
  content: var(--tw-content);
  border-color: var(--color-neutral-88);
}
.before\\:border-color-neutral-93::before {
  content: var(--tw-content);
  border-color: var(--color-neutral-93);
}
.before\\:border-t-color-level-1::before {
  content: var(--tw-content);
  border-top-color: var(--color-level-1);
}
.before\\:border-t-color-neutral-88::before {
  content: var(--tw-content);
  border-top-color: var(--color-neutral-88);
}
.before\\:border-t-color-neutral-93::before {
  content: var(--tw-content);
  border-top-color: var(--color-neutral-93);
}
.before\\:border-t-transparent::before {
  content: var(--tw-content);
  border-top-color: transparent;
}
.before\\:content-\\[\\'\\'\\]::before {
  --tw-content: '';
  content: var(--tw-content);
}
.after\\:absolute::after {
  content: var(--tw-content);
  position: absolute;
}
.after\\:block::after {
  content: var(--tw-content);
  display: block;
}
.after\\:h-full::after {
  content: var(--tw-content);
  height: 100%;
}
.after\\:w-full::after {
  content: var(--tw-content);
  width: 100%;
}
@keyframes spin {

  to {
    content: var(--tw-content);
    transform: rotate(360deg);
  }
}
.after\\:animate-spin::after {
  content: var(--tw-content);
  animation: spin var(--tw-animate-duration, 1s) var(--tw-animate-easing, linear) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite) var(--tw-animate-fill, none);
}
.after\\:rounded-full::after {
  content: var(--tw-content);
  border-radius: 9999px;
}
.after\\:border-2::after {
  content: var(--tw-content);
  border-width: 2px;
}
.after\\:border-solid::after {
  content: var(--tw-content);
  border-style: solid;
}
.after\\:border-color-level-1::after {
  content: var(--tw-content);
  border-color: var(--color-level-1);
}
.after\\:border-color-neutral-88::after {
  content: var(--tw-content);
  border-color: var(--color-neutral-88);
}
.after\\:border-color-neutral-93::after {
  content: var(--tw-content);
  border-color: var(--color-neutral-93);
}
.after\\:border-transparent::after {
  content: var(--tw-content);
  border-color: transparent;
}
.after\\:border-t-color-accent-50::after {
  content: var(--tw-content);
  border-top-color: var(--color-accent-50);
}
.after\\:border-t-color-neutral-88::after {
  content: var(--tw-content);
  border-top-color: var(--color-neutral-88);
}
.after\\:border-t-color-neutral-93::after {
  content: var(--tw-content);
  border-top-color: var(--color-neutral-93);
}
.after\\:delay-150::after {
  content: var(--tw-content);
  transition-delay: 150ms;
}
.after\\:content-\\[\\'\\'\\]::after {
  --tw-content: '';
  content: var(--tw-content);
}
.last\\:mb-0:last-child {
  margin-bottom: 0px;
}
.first-of-type\\:-mt-2:first-of-type {
  margin-top: -0.5rem;
}
.open\\:flex[open] {
  display: flex;
}
.open\\:items-start[open] {
  align-items: flex-start;
}
.open\\:items-center[open] {
  align-items: center;
}
.open\\:justify-end[open] {
  justify-content: flex-end;
}
.open\\:justify-center[open] {
  justify-content: center;
}
.focus-within\\:border-\\[\\#1877d7\\]:focus-within {
  --tw-border-opacity: 1;
  border-color: rgb(24 119 215 / var(--tw-border-opacity, 1));
}
.focus-within\\:shadow-chatInputFocusShadow:focus-within {
  --tw-shadow: var(--box-shadow-chat-input-shadow-light);
  --tw-shadow-colored: var(--box-shadow-chat-input-shadow-light);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.hover\\:border-color-neutral-88:hover {
  border-color: var(--color-neutral-88);
}
.hover\\:border-color-neutral-93:hover {
  border-color: var(--color-neutral-93);
}
.hover\\:\\!bg-color-neutral-92-60:hover {
  background-color: var(--color-neutral-92-60) !important;
}
.hover\\:\\!bg-transparent:hover {
  background-color: transparent !important;
}
.hover\\:bg-blue-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-blue-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-color-accent-40:hover {
  background-color: var(--color-accent-40);
}
.hover\\:bg-color-accent-45:hover {
  background-color: var(--color-accent-45);
}
.hover\\:bg-color-accent-60:hover {
  background-color: var(--color-accent-60);
}
.hover\\:bg-color-level-2:hover {
  background-color: var(--color-level-2);
}
.hover\\:bg-color-level-3:hover {
  background-color: var(--color-level-3);
}
.hover\\:bg-color-neutral-88:hover {
  background-color: var(--color-neutral-88);
}
.hover\\:bg-color-neutral-90:hover {
  background-color: var(--color-neutral-90);
}
.hover\\:bg-color-neutral-92:hover {
  background-color: var(--color-neutral-92);
}
.hover\\:bg-color-neutral-92-40:hover {
  background-color: var(--color-neutral-92-40);
}
.hover\\:bg-color-neutral-92-60:hover {
  background-color: var(--color-neutral-92-60);
}
.hover\\:bg-color-neutral-93:hover {
  background-color: var(--color-neutral-93);
}
.hover\\:bg-color-neutral-98:hover {
  background-color: var(--color-neutral-98);
}
.hover\\:bg-color-state-error:hover {
  background-color: var(--color-state-error);
}
.hover\\:bg-gray-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-transparent:hover {
  background-color: transparent;
}
.hover\\:bg-\\[repeating-linear-gradient\\(to_right\\2c theme\\(colors\\.color-text-a\\)_0\\2c theme\\(colors\\.color-text-a\\)_1px\\2c transparent_1px\\2c transparent_2px\\)\\]:hover {
  background-image: repeating-linear-gradient(to right,var(--color-text-a) 0,var(--color-text-a) 1px,transparent 1px,transparent 2px);
}
.hover\\:text-color-text-01:hover {
  color: var(--color-text-01);
}
.hover\\:text-color-text-a:hover {
  color: var(--color-text-a);
}
.hover\\:text-color-text-a-hover:hover {
  color: var(--color-text-a-hover);
}
.hover\\:text-gray-700:hover {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.hover\\:opacity-100:hover {
  opacity: 1;
}
.hover\\:opacity-80:hover {
  opacity: 0.8;
}
.hover\\:shadow-\\[0px_2px_4px_0px_rgba\\(23\\2c 26\\2c 28\\2c 0\\.2\\)\\]:hover {
  --tw-shadow: 0px 2px 4px 0px rgba(23,26,28,0.2);
  --tw-shadow-colored: 0px 2px 4px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.focus\\:border-color-accent-50:focus {
  border-color: var(--color-accent-50);
}
.focus\\:text-color-text-02:focus {
  color: var(--color-text-02);
}
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-blue-300:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(147 197 253 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-blue-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-red-300:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(252 165 165 / var(--tw-ring-opacity, 1));
}
.focus-visible\\:opacity-100:focus-visible {
  opacity: 1;
}
.focus-visible\\:\\[outline\\:2px_auto_-webkit-focus-ring-color\\]:focus-visible {
  outline: 2px auto -webkit-focus-ring-color;
}
.active\\:bg-color-accent-45:active {
  background-color: var(--color-accent-45);
}
.disabled\\:pointer-events-none:disabled {
  pointer-events: none;
}
.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
.disabled\\:border-transparent:disabled {
  border-color: transparent;
}
.disabled\\:bg-color-neutral-88:disabled {
  background-color: var(--color-neutral-88);
}
.disabled\\:bg-color-neutral-92:disabled {
  background-color: var(--color-neutral-92);
}
.disabled\\:text-color-text-03:disabled {
  color: var(--color-text-03);
}
.disabled\\:opacity-30:disabled {
  opacity: 0.3;
}
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}
.group:focus-within .group-focus-within\\:opacity-100 {
  opacity: 1;
}
.group:hover .group-hover\\:pointer-events-auto {
  pointer-events: auto;
}
.group:hover .group-hover\\:flex {
  display: flex;
}
.group:hover .group-hover\\:hidden {
  display: none;
}
.group\\/pill:hover .group-hover\\/pill\\:scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.group\\/pill:hover .group-hover\\/pill\\:scale-50 {
  --tw-scale-x: .5;
  --tw-scale-y: .5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.group:hover .group-hover\\:bg-color-neutral-92 {
  background-color: var(--color-neutral-92);
}
.group:hover .group-hover\\:bg-color-neutral-92-60 {
  background-color: var(--color-neutral-92-60);
}
.group:hover .group-hover\\:text-color-text-01 {
  color: var(--color-text-01);
}
.group\\/pill:hover .group-hover\\/pill\\:opacity-0 {
  opacity: 0;
}
.group\\/pill:hover .group-hover\\/pill\\:opacity-100 {
  opacity: 1;
}
.group\\/pill:hover .group-hover\\/pill\\:opacity-20 {
  opacity: 0.2;
}
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}
.group\\/pill:focus-visible .group-focus-visible\\/pill\\:opacity-100 {
  opacity: 1;
}
.group:active .group-active\\:bg-color-neutral-92 {
  background-color: var(--color-neutral-92);
}
@container (min-width: 768px) {

  .\\@\\[768px\\]\\:max-w-\\[640px\\] {
    max-width: 640px;
  }
}
@container (min-width: 1024px) {

  .\\@\\[1024px\\]\\:w-\\[768px\\] {
    width: 768px;
  }

  .\\@\\[1024px\\]\\:max-w-\\[768px\\] {
    max-width: 768px;
  }
}
@media (max-width: 400px) {

  .max-\\[400px\\]\\:mx-0 {
    margin-left: 0px;
    margin-right: 0px;
  }

  .max-\\[400px\\]\\:hidden {
    display: none;
  }

  .max-\\[400px\\]\\:w-auto {
    width: auto;
  }

  .max-\\[400px\\]\\:w-full {
    width: 100%;
  }

  .max-\\[400px\\]\\:min-w-0 {
    min-width: 0px;
  }

  .max-\\[400px\\]\\:max-w-full {
    max-width: 100%;
  }

  .max-\\[400px\\]\\:flex-1 {
    flex: 1 0 0;
  }

  .max-\\[400px\\]\\:flex-grow {
    flex-grow: 1;
  }

  .max-\\[400px\\]\\:flex-col {
    flex-direction: column;
  }

  .max-\\[400px\\]\\:items-start {
    align-items: flex-start;
  }

  .max-\\[400px\\]\\:gap-1 {
    gap: 0.25rem;
  }
}
@media (min-width: 800px) {

  .md\\:col-span-2 {
    grid-column: span 2 / span 2;
  }

  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1068px) {

  .lg\\:col-span-3 {
    grid-column: span 3 / span 3;
  }

  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.rtl\\:pr-\\[18px\\]:where([dir="rtl"], [dir="rtl"] *) {
  padding-right: 18px;
}
.dark\\:border-blue-300:is([data-theme='opera-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));
}
.dark\\:border-blue-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(30 64 175 / 0.3);
}
.dark\\:border-cyan-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(21 94 117 / 0.3);
}
.dark\\:border-gray-700:is([data-theme='opera-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(55 65 81 / var(--tw-border-opacity, 1));
}
.dark\\:border-gray-800:is([data-theme='opera-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800:is([data-theme='opera-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(22 101 52 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(22 101 52 / 0.3);
}
.dark\\:border-indigo-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(55 48 163 / 0.3);
}
.dark\\:border-purple-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(107 33 168 / 0.3);
}
.dark\\:border-red-800:is([data-theme='opera-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(153 27 27 / var(--tw-border-opacity, 1));
}
.dark\\:border-red-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(153 27 27 / 0.3);
}
.dark\\:border-yellow-800\\/30:is([data-theme='opera-dark'] *) {
  border-color: rgb(133 77 14 / 0.3);
}
.dark\\:bg-blue-800:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 64 175 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-blue-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(30 58 138 / 0.2);
}
.dark\\:bg-color-accent-80:is([data-theme='opera-dark'] *) {
  background-color: var(--color-accent-80);
}
.dark\\:bg-color-level-5:is([data-theme='opera-dark'] *) {
  background-color: var(--color-level-5);
}
.dark\\:bg-cyan-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(22 78 99 / 0.2);
}
.dark\\:bg-gray-700:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-gray-800:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-gray-800\\/50:is([data-theme='opera-dark'] *) {
  background-color: rgb(31 41 55 / 0.5);
}
.dark\\:bg-gray-900:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-green-800:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(22 101 52 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-green-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(20 83 45 / 0.2);
}
.dark\\:bg-indigo-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(49 46 129 / 0.2);
}
.dark\\:bg-purple-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(88 28 135 / 0.2);
}
.dark\\:bg-red-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(127 29 29 / 0.2);
}
.dark\\:bg-yellow-900\\/20:is([data-theme='opera-dark'] *) {
  background-color: rgb(113 63 18 / 0.2);
}
.dark\\:bg-background-login-dark:is([data-theme='opera-dark'] *) {
  background-image: linear-gradient(90deg, rgb(144 98 157 / 0.2) 0%, rgb(108 108 178 / 0.2) 37.02%, rgb(146 149 232 / 0.2) 71.63%);;
}
.dark\\:text-blue-100:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(219 234 254 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-400:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1));
}
.dark\\:text-color-text-03:is([data-theme='opera-dark'] *) {
  color: var(--color-text-03);
}
.dark\\:text-cyan-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(103 232 249 / var(--tw-text-opacity, 1));
}
.dark\\:text-cyan-400:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(34 211 238 / var(--tw-text-opacity, 1));
}
.dark\\:text-gray-200:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(229 231 235 / var(--tw-text-opacity, 1));
}
.dark\\:text-gray-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
}
.dark\\:text-gray-400:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-100:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(220 252 231 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.dark\\:text-indigo-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(165 180 252 / var(--tw-text-opacity, 1));
}
.dark\\:text-purple-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(216 180 254 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-400:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-300:is([data-theme='opera-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.dark\\:shadow-aria-dark-m:is([data-theme='opera-dark'] *) {
  --tw-shadow: 0 10px 20px 4px rgba(0, 0, 0, 0.32);
  --tw-shadow-colored: 0 10px 20px 4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.dark\\:focus-within\\:shadow-chatInputFocusShadowDark:focus-within:is([data-theme='opera-dark'] *) {
  --tw-shadow: var(--box-shadow-chat-input-shadow-dark);
  --tw-shadow-colored: var(--box-shadow-chat-input-shadow-dark);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.dark\\:hover\\:bg-gray-400:hover:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
}
.dark\\:hover\\:bg-gray-800:hover:is([data-theme='opera-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}
.dark\\:border-blue-300:is([data-theme='opera-gx-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));
}
.dark\\:border-blue-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(30 64 175 / 0.3);
}
.dark\\:border-cyan-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(21 94 117 / 0.3);
}
.dark\\:border-gray-700:is([data-theme='opera-gx-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(55 65 81 / var(--tw-border-opacity, 1));
}
.dark\\:border-gray-800:is([data-theme='opera-gx-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800:is([data-theme='opera-gx-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(22 101 52 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(22 101 52 / 0.3);
}
.dark\\:border-indigo-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(55 48 163 / 0.3);
}
.dark\\:border-purple-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(107 33 168 / 0.3);
}
.dark\\:border-red-800:is([data-theme='opera-gx-dark'] *) {
  --tw-border-opacity: 1;
  border-color: rgb(153 27 27 / var(--tw-border-opacity, 1));
}
.dark\\:border-red-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(153 27 27 / 0.3);
}
.dark\\:border-yellow-800\\/30:is([data-theme='opera-gx-dark'] *) {
  border-color: rgb(133 77 14 / 0.3);
}
.dark\\:bg-blue-800:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 64 175 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-blue-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(30 58 138 / 0.2);
}
.dark\\:bg-color-accent-80:is([data-theme='opera-gx-dark'] *) {
  background-color: var(--color-accent-80);
}
.dark\\:bg-color-level-5:is([data-theme='opera-gx-dark'] *) {
  background-color: var(--color-level-5);
}
.dark\\:bg-cyan-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(22 78 99 / 0.2);
}
.dark\\:bg-gray-700:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-gray-800:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-gray-800\\/50:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(31 41 55 / 0.5);
}
.dark\\:bg-gray-900:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-green-800:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(22 101 52 / var(--tw-bg-opacity, 1));
}
.dark\\:bg-green-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(20 83 45 / 0.2);
}
.dark\\:bg-indigo-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(49 46 129 / 0.2);
}
.dark\\:bg-purple-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(88 28 135 / 0.2);
}
.dark\\:bg-red-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(127 29 29 / 0.2);
}
.dark\\:bg-yellow-900\\/20:is([data-theme='opera-gx-dark'] *) {
  background-color: rgb(113 63 18 / 0.2);
}
.dark\\:bg-background-login-dark:is([data-theme='opera-gx-dark'] *) {
  background-image: linear-gradient(90deg, rgb(144 98 157 / 0.2) 0%, rgb(108 108 178 / 0.2) 37.02%, rgb(146 149 232 / 0.2) 71.63%);;
}
.dark\\:text-blue-100:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(219 234 254 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-400:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1));
}
.dark\\:text-color-text-03:is([data-theme='opera-gx-dark'] *) {
  color: var(--color-text-03);
}
.dark\\:text-cyan-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(103 232 249 / var(--tw-text-opacity, 1));
}
.dark\\:text-cyan-400:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(34 211 238 / var(--tw-text-opacity, 1));
}
.dark\\:text-gray-200:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(229 231 235 / var(--tw-text-opacity, 1));
}
.dark\\:text-gray-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
}
.dark\\:text-gray-400:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-100:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(220 252 231 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.dark\\:text-indigo-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(165 180 252 / var(--tw-text-opacity, 1));
}
.dark\\:text-purple-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(216 180 254 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-400:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-300:is([data-theme='opera-gx-dark'] *) {
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.dark\\:shadow-aria-dark-m:is([data-theme='opera-gx-dark'] *) {
  --tw-shadow: 0 10px 20px 4px rgba(0, 0, 0, 0.32);
  --tw-shadow-colored: 0 10px 20px 4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.dark\\:focus-within\\:shadow-chatInputFocusShadowDark:focus-within:is([data-theme='opera-gx-dark'] *) {
  --tw-shadow: var(--box-shadow-chat-input-shadow-dark);
  --tw-shadow-colored: var(--box-shadow-chat-input-shadow-dark);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.dark\\:hover\\:bg-gray-400:hover:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
}
.dark\\:hover\\:bg-gray-800:hover:is([data-theme='opera-gx-dark'] *) {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}
.\\[\\&\\&_p\\]\\:m-\\[8px\\].\\[\\&\\&_p\\]\\:m-\\[8px\\] p {
  margin: 8px;
}
.\\[\\&\\:has\\(\\:focus-visible\\)\\]\\:outline:has(:focus-visible) {
  outline-style: solid;
}
.\\[\\&\\:has\\(\\:focus-visible\\)\\]\\:outline-2:has(:focus-visible) {
  outline-width: 2px;
}
.\\[\\&\\:has\\(\\:focus-visible\\)\\]\\:outline-offset-1:has(:focus-visible) {
  outline-offset: 1px;
}
.\\[\\&\\:has\\(\\:focus-visible\\)\\]\\:outline-color-accent-50:has(:focus-visible) {
  outline-color: var(--color-accent-50);
}
.\\[\\&\\:not\\(\\:first-child\\)\\]\\:pt-2:not(:first-child) {
  padding-top: 0.5rem;
}
.\\[\\&\\>li\\>p\\]\\:inline>li>p {
  display: inline;
}
.\\[\\&\\>li\\]\\:list-disc>li {
  list-style-type: disc;
}
.\\[\\&\\>p\\:not\\(\\:first-child\\)\\]\\:mt-4>p:not(:first-child) {
  margin-top: 1rem;
}
.\\[\\&_\\.katex-display\\]\\:overflow-x-auto .katex-display {
  overflow-x: auto;
}
.\\[\\&_\\.katex-display\\]\\:overflow-y-hidden .katex-display {
  overflow-y: hidden;
}
.\\[\\&_\\.katex-display\\]\\:py-1 .katex-display {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
@media(max-height:480px) {

  .\\[\\@media\\(max-height\\:480px\\)\\]\\:hidden {
    display: none;
  }
}
@media(max-width:320px) {

  .\\[\\@media\\(max-width\\:320px\\)\\]\\:hidden {
    display: none;
  }
}
`,"",{version:3,sources:["webpack://./node_modules/tailwindcss/base.css","webpack://./node_modules/tailwindcss/components.css","webpack://./src/root/components.css","webpack://./node_modules/tailwindcss/utilities.css","webpack://./src/root/utilities.css","webpack://./src/root/fonts.css","webpack://./src/root/Animations.css","webpack://./src/devtools/Devtools.css"],names:[],mappings:"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AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB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AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,8BAAmB;EAAnB,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,4BAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,6BAAmB;EAAnB,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,0BAAmB;EAAnB,0BAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,0BAAmB;EAAnB;AAAmB;AAAnB;EAAA,yBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB,gBAAmB;EAAnB;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA,UAAmB;IAAnB;EAAmB;;EAAnB;IAAA,UAAmB;IAAnB;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA;EAAmB;;EAAnB;IAAA;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA,UAAmB;IAAnB;EAAmB;;EAAnB;IAAA,UAAmB;IAAnB;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA;EAAmB;;EAAnB;IAAA;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;;EAAA;IAAA;EAAmB;;EAAnB;IAAA;EAAmB;AAAA;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,yBAAmB;KAAnB,sBAAmB;UAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,wBAAmB;KAAnB,qBAAmB;UAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,yBAAmB;OAAnB;AAAmB;AAAnB;EAAA,oBAAmB;OAAnB;AAAmB;AAAnB;EAAA,oBAAmB;OAAnB;AAAmB;AAAnB;EAAA,qBAAmB;OAAnB;AAAmB;AAAnB;EAAA,qBAAmB;OAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB,2DAAmB;EAAnB;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB,+DAAmB;EAAnB;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB,8DAAmB;EAAnB;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB,4DAAmB;EAAnB;AAAmB;AAAnB;EAAA,uBAAmB;EAAnB,2DAAmB;EAAnB;AAAmB;AAAnB;EAAA,wBAAmB;EAAnB,kEAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,gBAAmB;EAAnB,uBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,2CAAmB;EAAnB;AAAmB;AAAnB;EAAA,kCAAmB;EAAnB;AAAmB;AAAnB;EAAA,uCAAmB;EAAnB;AAAmB;AAAnB;EAAA,wCAAmB;EAAnB;AAAmB;AAAnB;EAAA,2BAAmB;EAAnB;AAAmB;AAAnB;EAAA,uCAAmB;EAAnB;AAAmB;AAAnB;EAAA,8BAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AA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mB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,yBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,eAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,eAAmB;EAAnB;AAAmB;AAAnB;EAAA,eAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,+BAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB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",sourcesContent:["@tailwind base;\n","@tailwind components;\n","@layer components {\n  .custom-bullet {\n    @apply relative before:block before:h-1.25 before:w-1.25 before:rounded-full;\n    @apply before:absolute before:-left-3.25 before:top-2.5 before:bg-current;\n    @apply before:content-[''] rtl:before:-right-3.25;\n  }\n\n  .tab-view.opera-one .bg-right-gradient::after {\n    content: \"\";\n\n    @apply pointer-events-none\n      absolute\n      right-0\n      top-0\n      block\n      h-full\n      w-[35%]\n      bg-[url('@/assets/right-gradient.svg')]\n      bg-no-repeat\n      blur-[90px]\n      filter\n      [background-position:100%_50%]\n      [background-size:90%_100%];\n  }\n}\n","@tailwind utilities;\n","@layer utilities {\n  /**\n   * Typography\n   */\n  .text-header-xxl {\n    font-family: var(--header-xxl-font-family);\n    font-size: var(--header-xxl-font-size);\n    font-style: var(--header-xxl-font-style);\n    font-weight: var(--header-xxl-font-weight);\n    line-height: var(--header-xxl-line-height);\n    text-transform: var(--header-xxl-text-transform);\n  }\n\n  .text-header-xl {\n    font-family: var(--header-xl-font-family);\n    font-size: var(--header-xl-font-size);\n    font-style: var(--header-xl-font-style);\n    font-weight: var(--header-xl-font-weight);\n    line-height: var(--header-xl-line-height);\n    text-transform: var(--header-xl-text-transform);\n  }\n\n  .text-header-l {\n    font-family: var(--header-l-font-family);\n    font-size: var(--header-l-font-size);\n    font-style: var(--header-l-font-style);\n    font-weight: var(--header-l-font-weight);\n    line-height: var(--header-l-line-height);\n    text-transform: var(--header-l-text-transform);\n  }\n\n  .text-header-m {\n    font-family: var(--header-m-font-family);\n    font-size: var(--header-m-font-size);\n    font-style: var(--header-m-font-style);\n    font-weight: var(--header-m-font-weight);\n    line-height: var(--header-m-line-height);\n    text-transform: var(--header-m-text-transform);\n  }\n\n  .text-header-s {\n    font-family: var(--header-s-font-family);\n    font-size: var(--header-s-font-size);\n    font-style: var(--header-s-font-style);\n    font-weight: var(--header-s-font-weight);\n    line-height: var(--header-s-line-height);\n    text-transform: var(--header-s-text-transform);\n  }\n\n  .text-subheader-l {\n    font-family: var(--sub-header-l-font-family);\n    font-size: var(--sub-header-l-font-size);\n    font-style: var(--sub-header-l-font-style);\n    font-weight: var(--sub-header-l-font-weight);\n    line-height: var(--sub-header-l-line-height);\n    text-transform: var(--sub-header-l-text-transform);\n  }\n\n  .text-subheader-m {\n    font-family: var(--sub-header-m-font-family);\n    font-size: var(--sub-header-m-font-size);\n    font-style: var(--sub-header-m-font-style);\n    font-weight: var(--sub-header-m-font-weight);\n    line-height: var(--sub-header-m-line-height);\n    text-transform: var(--sub-header-m-text-transform);\n  }\n\n  .text-subheader-s {\n    font-family: var(--sub-header-s-font-family);\n    font-size: var(--sub-header-s-font-size);\n    font-style: var(--sub-header-s-font-style);\n    font-weight: var(--sub-header-s-font-weight);\n    line-height: var(--sub-header-s-line-height);\n    text-transform: var(--sub-header-s-text-transform);\n  }\n\n  .text-subheader-xs {\n    font-family: var(--sub-header-xs-font-family);\n    font-size: var(--sub-header-xs-font-size);\n    font-style: var(--sub-header-xs-font-style);\n    font-weight: var(--sub-header-xs-font-weight);\n    line-height: var(--sub-header-xs-line-height);\n    text-transform: var(--sub-header-xs-text-transform);\n  }\n\n  .response-header-1,\n  .response-header-2 {\n    margin: 20px 0 12px;\n  }\n\n  .response-header-3 {\n    margin: 16px 0 12px;\n  }\n\n  .response-header-4,\n  .response-header-5,\n  .response-header-6 {\n    margin: 16px 0 8px;\n  }\n\n  .response-header-2 > strong {\n    font-weight: 700;\n  }\n\n  .message li > strong {\n    font-weight: 600;\n  }\n\n  .response-header-1,\n  .response-header-2 {\n    font-family: var(--header-l-font-family);\n    font-size: var(--header-l-font-size);\n    font-style: var(--header-l-font-style);\n    font-weight: var(--header-l-font-weight);\n    line-height: var(--header-l-line-height);\n    text-transform: var(--header-l-text-transform);\n  }\n\n  .response-header-3 {\n    font-family: var(--header-m-font-family);\n    font-size: var(--header-m-font-size);\n    font-style: var(--header-m-font-style);\n    font-weight: var(--header-m-font-weight);\n    line-height: var(--header-m-line-height);\n    text-transform: var(--header-m-text-transform);\n  }\n\n  .response-header-4,\n  .response-header-5,\n  .response-header-6 {\n    font-family: var(--header-s-font-family);\n    font-size: var(--header-s-font-size);\n    font-style: var(--header-s-font-style);\n    font-weight: var(--header-s-font-weight);\n    line-height: var(--header-s-line-height);\n    text-transform: var(--header-s-text-transform);\n  }\n\n  .text-body-l {\n    font-family: var(--body-l-font-family);\n    font-size: var(--body-l-font-size);\n    font-style: var(--body-l-font-style);\n    font-weight: var(--body-l-font-weight);\n    line-height: var(--body-l-line-height);\n    text-transform: var(--body-l-text-transform);\n  }\n\n  .text-body-m {\n    font-family: var(--body-m-font-family);\n    font-size: var(--body-m-font-size);\n    font-style: var(--body-m-font-style);\n    font-weight: var(--body-m-font-weight);\n    line-height: var(--body-m-line-height);\n    text-transform: var(--body-m-text-transform);\n  }\n\n  .text-body-s {\n    font-family: var(--body-s-font-family);\n    font-size: var(--body-s-font-size);\n    font-style: var(--body-s-font-style);\n    font-weight: var(--body-s-font-weight);\n    line-height: var(--body-s-line-height);\n    text-transform: var(--body-s-text-transform);\n  }\n\n  .text-body-xs {\n    font-family: var(--body-xs-font-family);\n    font-size: var(--body-xs-font-size);\n    font-style: var(--body-xs-font-style);\n    font-weight: var(--body-xs-font-weight);\n    line-height: var(--body-xs-line-height);\n    text-transform: var(--body-xs-text-transform);\n  }\n\n  .text-button-l {\n    font-family: var(--button-l-font-family);\n    font-size: var(--button-l-font-size);\n    font-style: var(--button-l-font-style);\n    font-weight: var(--button-l-font-weight);\n    line-height: var(--button-l-line-height);\n    text-transform: var(--button-l-text-transform);\n  }\n\n  .text-button-m {\n    font-family: var(--button-m-font-family);\n    font-size: var(--button-m-font-size);\n    font-style: var(--button-m-font-style);\n    font-weight: var(--button-m-font-weight);\n    line-height: var(--button-m-line-height);\n    text-transform: var(--button-m-text-transform);\n  }\n\n  .text-button-s {\n    font-family: var(--button-s-font-family);\n    font-size: var(--button-s-font-size);\n    font-style: var(--button-s-font-style);\n    font-weight: var(--button-s-font-weight);\n    line-height: var(--button-s-line-height);\n    text-transform: var(--button-s-text-transform);\n  }\n\n  .text-code-bold {\n    font-family: var(--code-bold-font-family);\n    font-size: var(--code-bold-font-size);\n    font-style: var(--code-bold-font-style);\n    font-weight: var(--code-bold-font-weight);\n    line-height: var(--code-bold-line-height);\n    text-transform: var(--code-bold-text-transform);\n  }\n\n  .text-code-regular {\n    font-family: var(--code-regular-font-family);\n    font-size: var(--code-regular-font-size);\n    font-style: var(--code-regular-font-style);\n    font-weight: var(--code-regular-font-weight);\n    line-height: var(--code-regular-line-height);\n    text-transform: var(--code-regular-text-transform);\n  }\n\n  .text-quote-italic {\n    font-family: var(--quote-italic-font-family);\n    font-size: var(--quote-italic-font-size);\n    font-style: var(--quote-italic-font-style);\n    font-weight: var(--quote-italic-font-weight);\n    line-height: var(--quote-italic-line-height);\n    text-transform: var(--quote-italic-text-transform);\n  }\n\n  /**\n   * General mask properties\n   */\n  .mask-no-repeat {\n    -webkit-mask-repeat: no-repeat;\n  }\n  .mask-unset {\n    -webkit-mask-size: unset;\n  }\n  .mask-contain {\n    -webkit-mask-size: contain;\n  }\n  .mask-center {\n    -webkit-mask-position: center;\n  }\n  /**\n   * Specific asset mask\n   */\n  .mask-aria-white {\n    -webkit-mask-image: url(@/assets/icons/aria-icon-white.svg);\n  }\n  .mask-submit {\n    -webkit-mask-image: url(@/assets/icons/send-button.svg);\n    rotate: 90;\n  }\n  .mask-done {\n    -webkit-mask-image: url(@/assets/icons/edit-submit-icon.svg);\n    opacity: 0;\n  }\n  .mask-copy {\n    -webkit-mask-image: url(@/assets/icons/copy.svg);\n  }\n  .mask-retry {\n    -webkit-mask-image: url(@/assets/icons/retry.svg);\n  }\n\n  .gutter-stable {\n    scrollbar-gutter: stable;\n  }\n\n  /**\n   * Scrollbar hiding utilities\n   */\n  .scrollbar-hide::-webkit-scrollbar {\n    display: none;\n  }\n\n  .scrollbar-hide {\n    -ms-overflow-style: none;\n    scrollbar-width: none;\n  }\n\n  .chat-scroll::-webkit-scrollbar {\n    width: 4px;\n    height: 4px;\n  }\n\n  .chat-scroll::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  .chat-scroll::-webkit-scrollbar-thumb {\n    background-color: var(--color-neutral-93);\n    border-radius: 4px;\n  }\n\n  .chat-scroll::-webkit-scrollbar-thumb:hover {\n    background-color: var(--color-neutral-88);\n  }\n}\n\n.mask-chevron-left {\n  -webkit-mask-image: url(@/assets/icons/chevron-left.svg);\n}\n\n.mask-chevron-right {\n  -webkit-mask-image: url(@/assets/icons/chevron-right.svg);\n}\n\n/* Border images */\n.border-image-1-header {\n  border-image: var(--border-image-1-header);\n}\n\n.markdown-table tr td,\n.markdown-table tr th {\n  border-right: 1px solid var(--color-level-0);\n}\n.markdown-table tbody tr td,\n.markdown-table tbody tr th {\n  border-top: 1px solid var(--color-level-0);\n}\n.markdown-table tr td:last-child,\n.markdown-table tr th:last-child {\n  border-right: none;\n}\n\n.code-box {\n  border-color: var(--color-neutral-90);\n}\n.markdown-table tr td,\n.markdown-table tr th {\n  border-right: none;\n  background: none;\n}\n\n.markdown-table tbody tr td,\n.markdown-table tbody tr th {\n  border-top: 1px solid var(--color-neutral-90);\n}\n.markdown-table tr td:last-child,\n.markdown-table tr th:last-child {\n  border-right: none;\n}\n\n/* 'anywhere' is not supported by current Tailwind version, so utility css class has been created */\n.break-anywhere {\n  overflow-wrap: anywhere;\n}\n\n/* other vars */\n:root {\n  -webkit-font-smoothing: antialiased;\n  --opera-chatbot-blockquote-bg: transparent;\n  --default-scrollbar-width: 6px;\n}\n",'@font-face {\n  font-family: "Space Mono";\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n  src: url(@/assets/fonts/SpaceMono-Regular.ttf) format("truetype");\n}\n\n@font-face {\n  font-family: "Space Mono";\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(@/assets/fonts/SpaceMono-Bold.ttf) format("truetype");\n}\n',"@keyframes inputJump {\n  0% {\n    transform: scale(100%);\n  }\n  50% {\n    transform: scale(96%);\n  }\n  100% {\n    transform: scale(100%);\n  }\n}\n\n@keyframes inputDustOpacityStart {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 100%;\n  }\n}\n\n@keyframes inputDustOpacityEnd {\n  0% {\n    opacity: 100%;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n\n@keyframes inputDustScaleUp {\n  0% {\n    transform: scale(1);\n  }\n  100% {\n    transform: scale(1.1);\n  }\n}\n\n@keyframes inputSidebarDustScaleUp {\n  0% {\n    transform: translate(-50%, -50%) scale(0);\n  }\n  100% {\n    transform: translate(-50%, -50%) scale(1);\n  }\n}\n\n@keyframes scale-in {\n  0% {\n    opacity: 0;\n    transform-origin: top left;\n    transform: scale(0);\n  }\n  100% {\n    opacity: 1;\n    transform-origin: top left;\n    transform: scale(1);\n  }\n}\n\n@keyframes appear {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes typing {\n  from {\n    max-width: 0;\n  }\n  to {\n    max-width: 100%;\n  }\n}\n@keyframes blink {\n  50% {\n    opacity: 0;\n  }\n}\n",'@import "tailwindcss/base";\n@import "tailwindcss/components";\n@import "tailwindcss/utilities";\n\n@import "../root/components.css";\n@import "../root/fonts.css";\n@import "../root/Animations.css";\n@import "../root/utilities.css";\n@import "../root/base.css";\n\nbody {\n  border-radius: 4px 4px 0px 0px;\n  margin: 0;\n  padding: 0;\n}\n'],sourceRoot:""}]);let k=b},12298(){}},s={};function l(A){var e=s[A];if(void 0!==e)return e.exports;var t=s[A]={id:A,loaded:!1,exports:{}};return i[A].call(t.exports,t,t.exports,l),t.loaded=!0,t.exports}l.m=i,l.n=A=>{var e=A&&A.__esModule?()=>A.default:()=>A;return l.d(e,{a:e}),e},e=Object.getPrototypeOf?A=>Object.getPrototypeOf(A):A=>A.__proto__,l.t=function(t,r){if(1&r&&(t=this(t)),8&r||"object"==typeof t&&t&&(4&r&&t.__esModule||16&r&&"function"==typeof t.then))return t;var n=Object.create(null);l.r(n);var a={};A=A||[null,e({}),e([]),e(e)];for(var o=2&r&&t;("object"==typeof o||"function"==typeof o)&&!~A.indexOf(o);o=e(o))Object.getOwnPropertyNames(o).forEach(A=>{a[A]=()=>t[A]});return a.default=()=>t,l.d(n,a),n},l.d=(A,e)=>{for(var t in e)l.o(e,t)&&!l.o(A,t)&&Object.defineProperty(A,t,{enumerable:!0,get:e[t]})},l.e=()=>Promise.resolve();var d=l;l.g=(()=>{if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(A){if("object"==typeof window)return window}})(),l.o=(A,e)=>Object.prototype.hasOwnProperty.call(A,e),l.r=A=>{"u">typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(A,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(A,"__esModule",{value:!0})},l.nmd=A=>(A.paths=[],A.children||(A.children=[]),A),t=[],l.O=(A,e,r,n)=>{if(e){n=n||0;for(var a=t.length;a>0&&t[a-1][2]>n;a--)t[a]=t[a-1];t[a]=[e,r,n];return}for(var o=1/0,a=0;a<t.length;a++){for(var[e,r,n]=t[a],i=!0,s=0;s<e.length;s++)(!1&n||o>=n)&&Object.keys(l.O).every(A=>l.O[A](e[s]))?e.splice(s--,1):(i=!1,n<o&&(o=n));if(i){t.splice(a--,1);var d=r();void 0!==d&&(A=d)}}return A},l.p="",l.rv=()=>"1.7.11",l.j="1278",l.b=new URL("./",import.meta.url),r={1278:0},l.C=A=>{var e,t,n=A.__rspack_esm_ids,a=A.__webpack_modules__,o=A.__rspack_esm_runtime,i=0;for(e in a)l.o(a,e)&&(l.m[e]=a[e]);for(o&&o(l);i<n.length;i++)t=n[i],l.o(r,t)&&r[t]&&r[t][0](),r[n[i]]=0;l.O()},l.O.j=function(A){return 0===r[A]},l.ruid="bundler=rspack@1.7.11";import*as c from"./blacklist.js";l.C(c);import*as m from"./handleReloadUI.js";l.C(m);import*as p from"./vendors.js";l.C(p);import*as B from"./common.js";l.C(B);import*as g from"./6214.js";l.C(g);var h=l.O(void 0,["9141","1573","1545","5005","6214"],()=>l(69424));l.O(h);export{d as __webpack_require__};