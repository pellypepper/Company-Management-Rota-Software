import React from "react";
import "./main.css";
import { NavLink} from "react-router-dom";



export default function Main() {

    return (
        <main className="main-wrapper">

            <div className="container-fluid bg-dark d-flex flex-column justify-content-center ">
                <div className="main-wrapper h-75 d-flex flex-column justify-content-center align-center w-75  mx-auto text-white mx-5 p-5">

                    <h1 className="text-center">Rota Software | Staff Management</h1>
                    <div className="row  ">
                        <div className="mt-5 row">

                        <NavLink  className="btn  " to='/login'>  <button variant="flat" size="xxl"> 
                                Login
                              </button>   </NavLink>
                              <NavLink  className="btn  mt-2" to='/register'>  <button  variant="flat" size="xxl">  
                                Sign Up
                                </button></NavLink> 

                        </div>


                    </div>

                </div>

            </div>




        </main>
    )

}
