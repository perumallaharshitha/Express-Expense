import Header from './files/Header/Header'
import { Outlet } from "react-router-dom";

function Page(){
    return (
        <div>
            <Header/>
            <div style={{minHeight:'100vh'}}>
                <Outlet/>
            </div>
        </div>
    )
}
export default Page;