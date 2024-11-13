import { Navbar, Container, Nav } from 'react-bootstrap'

const Navegacao = () => {
    return (
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/">Cadastro</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/usuarios">Usuários</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Navegacao