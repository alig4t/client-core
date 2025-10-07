
type Iprops = {
    msg:string | undefined,
    className?:string
}
export const ErrorFormText = ({msg,className=''}:Iprops) => {
    if(!msg) return <p></p>
    return  <p className={`text-[11px] text-red-800 mt-1.5 text-right ${className}`}>{msg}</p>
}