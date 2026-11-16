import {useMemo} from "react";
import {generatePath,matchPath,useLocation} from "react-router-dom";
import {routeConfig} from "@/router/Routes";
import {findMatchingRoute} from "@/core/router/matchRoute";
export interface BreadcrumbItem {label:string;href?:string;active?:boolean}
export function useBreadcrumbs(customLabel?:string):BreadcrumbItem[] {
  const {pathname}=useLocation();
  return useMemo(()=>{
    const current=findMatchingRoute(routeConfig,pathname);if(!current)return [{label:"خانه",href:"/dashboard"}];
    const params=matchPath({path:current.path,end:true},pathname)?.params??{};
    const items:BreadcrumbItem[]=[],seen=new Set<string>();
    let route:typeof current|undefined=current;
    while(route&&!seen.has(route.path)){
      seen.add(route.path);
      const active=route===current;let href:string|undefined;
      try{href=active?undefined:generatePath(route.path,params);}catch{href=undefined;}
      items.unshift({label:active&&customLabel?customLabel:route.label??route.name??"",href,active});
      route=route.parent?routeConfig.find(parent=>parent.path===route?.parent):undefined;
    }
    if(current.path!=="/dashboard"&&items[0]?.href!=="/dashboard")items.unshift({label:"خانه",href:"/dashboard"});
    return items;
  },[pathname,customLabel]);
}
