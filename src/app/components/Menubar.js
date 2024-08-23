export default function Menubar() {
    return (
        <div className="flex gap-5 bg-white p-2 rounded-md">
            <div><button className="hover:bg-slate-100 rounded-md ">Menu</button></div>
            <div><button className="hover:bg-slate-100 rounded-md ">Story</button></div>
            <div><button className="hover:bg-slate-100 rounded-md ">Reservation</button></div>
            <div><button className="hover:bg-slate-100 rounded-md ">Contact</button></div>
        </div>
    )
}