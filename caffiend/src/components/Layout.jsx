import Authentication from "./Authentication"
import Modal from "./Modal"
import { useState } from "react"

export default function Layout(props) {

    const {children}  = props
    const [showModal, setShowModal] = useState(false)

    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Coffee Insatiates</p>
            </div>
            <button onClick={() => {setShowModal(true)}}>
                <p>Sign up Free</p>
                <i className="fa-solid fa-mug-hot"></i>
            </button>
        </header>
    )

    const footer = (
        <footer>
            <p><span className="text-gradient">Caffiened</span> was made by <a target="_blank" href="https://www.linkedin.com/in/kevindainguyen/">Kevin Nguyen</a> 
            <br/> using the <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a> design library <br>
            </br> Check the project on <a target="_blank" href="https://github.com/KevDaiNguyen/CoffeeTrakcerTest">GitHub</a>!</p>
        </footer>
    )

    return(
        <>
            {showModal && (
                <Modal handleCloseModal={() => {setShowModal(false)}}>
                    <Authentication />
                </Modal>
            )}
            {header}
                <main>
                    {children}
                </main>
            {footer}
        </>
    )
}