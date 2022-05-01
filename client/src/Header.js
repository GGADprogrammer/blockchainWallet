import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
export default function Header() {
  return (
    <Navbar className="navbar">
      <Container className="justify-content-center">
        <Navbar.Brand className="navbar-brand" href="#home">
          SplitCoinWise
        </Navbar.Brand>
        {/* <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Account: <a href="#login">0x23490</a>
        </Navbar.Text>
      </Navbar.Collapse> */}
      </Container>
    </Navbar>
    // <Navbar bg="light" expand="lg">
    //   <Container>
    //     <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="me-auto">
    //         <Nav.Link href="#home">Home</Nav.Link>
    //         <Nav.Link href="#link">Link</Nav.Link>
    //         <NavDropdown title="Dropdown" id="basic-nav-dropdown">
    //           <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.2">
    //             Another action
    //           </NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
    //           <NavDropdown.Divider />
    //           <NavDropdown.Item href="#action/3.4">
    //             Separated link
    //           </NavDropdown.Item>
    //         </NavDropdown>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>

    // <nav
    //   className="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-3"
    //   id="mainNav"
    // >
    //   <div className="container">
    //     <a className="navbar-brand d-flex align-items-center" href="/">
    //       <span className="bs-icon-sm bs-icon-circle bs-icon-primary shadow d-flex justify-content-center align-items-center me-2 bs-icon">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="1em"
    //           height="1em"
    //           fill="currentColor"
    //           viewBox="0 0 16 16"
    //           className="bi bi-bezier"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
    //           ></path>
    //           <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5v-1zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
    //         </svg>
    //       </span>
    //       <span>SplitCoinWise</span>
    //     </a>
    //     <button
    //       data-bs-toggle="collapse"
    //       className="navbar-toggler"
    //       data-bs-target="#navcol-1"
    //     >
    //       <span className="visually-hidden">Toggle navigation</span>
    //       <span className="navbar-toggler-icon"></span>
    //     </button>
    //     <div className="collapse navbar-collapse" id="navcol-1">
    //       <ul className="navbar-nav mx-auto">
    //         <li className="nav-item">
    //           <a className="nav-link" href="services.html">
    //             Services
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link" href="pricing.html">
    //             Pricing
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link" href="contacts.html">
    //             Contacts
    //           </a>
    //         </li>
    //       </ul>
    //       <a
    //         className="btn btn-primary shadow"
    //         role="button"
    //         href="signup.html"
    //       >
    //         Sign up
    //       </a>
    //     </div>
    //   </div>
    // </nav>
  );
}
