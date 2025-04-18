import React from "react";
import './Category.css'
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


function Category() {
    const navigate = useNavigate();

    const [isCategoryPage, setIsCategoryPage] = useState(false);
    const location = useLocation();
    const path = location.pathname;


    useEffect(()=>{
        if(path === "/category"){
            setIsCategoryPage(true)
        }
        else{
            setIsCategoryPage(false)
        }
    },[path])

    return (
    <div className="container">
        {isCategoryPage && (
            <>
                <div className="card">
                    <Link to="travel" className="nav-link">Travel</Link>
                </div>
                <div className="card">
                    <Link to="food" className="nav-link">Food</Link>
                </div>
                <div className="card">
                    <Link to="subscription" className="nav-link">Subscription</Link>
                </div>
                <div className="card">
                    <Link to="clothing" className="nav-link">Clothing</Link>
                </div>
                <div className="second-row">
                    <div className="card">
                        <Link to="jewellery" className="nav-link">Jewellery</Link>
                    </div>
                    <div className="card">
                        <Link to="medical" className="nav-link">Medical</Link>
                    </div>
                    <div className="card">
                        <Link to="total" className="nav-link">Total</Link>
                    </div>
                </div>
            </>
        )}
        <Outlet />
    </div>
);

}
export default Category;
