let seconsdigit=20;

export default function timer()
{
    let tim=setInterval(()=>{
    
    
        if(seconsdigit===1)
        {
            clearInterval(tim);
        }
        seconsdigit=--seconsdigit;
        console.log(seconsdigit)
        return seconsdigit;
    
    },1000)

}