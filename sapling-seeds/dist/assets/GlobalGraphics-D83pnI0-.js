import{j as e,m as a}from"./vendor-framer-C8oba7p_.js";import"./vendor-router-BmXYTl0i.js";const p=()=>{const i=[{id:1,left:"5%",delay:0,duration:15,type:"🍃",size:"22px"},{id:2,left:"15%",delay:8,duration:25,type:"🌱",size:"18px"},{id:3,left:"35%",delay:2,duration:18,type:"🍃",size:"20px"},{id:4,left:"55%",delay:12,duration:22,type:"✨",size:"14px"},{id:5,left:"75%",delay:4,duration:16,type:"🍃",size:"24px"},{id:6,left:"90%",delay:10,duration:20,type:"🌱",size:"16px"},{id:7,left:"25%",delay:5,duration:28,type:"🍃",size:"19px"},{id:8,left:"65%",delay:15,duration:24,type:"✨",size:"12px"}];return e.jsxs("div",{className:"global-graphics-layer",style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,overflow:"hidden"},children:[e.jsx("style",{children:`
                @media (max-width: 768px) {
                    .graphic-item:nth-child(even) {
                        display: none !important;
                    }
                    .graphic-item {
                        font-size: 14px !important;
                        opacity: 0.25 !important;
                    }
                }
                `}),i.map(t=>e.jsx(a.div,{className:"graphic-item",initial:{y:"-10vh",opacity:0,rotate:0},animate:{y:["-5vh","110vh"],opacity:[0,.4,.4,0],rotate:[0,360,720],x:["0%","3%","-3%","3%"]},transition:{duration:t.duration,repeat:1/0,delay:t.delay,ease:"linear"},style:{position:"absolute",left:t.left,fontSize:`clamp(12px, 2vw, ${t.size})`,color:"#2a4130",filter:"blur(0.5px)"},children:t.type},t.id))]})};export{p as default};
