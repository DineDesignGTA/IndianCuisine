
import title from '../Data/title.json'

export default function Title() {
    return (
        <div className="flex flex-col justify-center gap-5 p-5 background-image min-h-screen ">
            
               
             
                    <section className = "font-cursive text-3xl text-center satisfy-regular text-orange-300">
                        {title.Header}
                    </section>  
            
                <span className="sm:text-9xl  text-8xl">
                    <h1 className="text-white font-bold text-shadow text-center font-titleFont">{title.Name}</h1>
                </span>

                <span className='flex justify-center'>
                    <p className="text-lg text-center max-w-prose text-white">
                        {title.Slogan}
                    </p>
                </span>

       
          
        </div>
    )
} 