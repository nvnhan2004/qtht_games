import { Component, ErrorInfo, ReactNode } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SideNav from '../components/SideNav'
import path from '../constants/path'

interface Props {
  children?: ReactNode
}

interface State {
    hasError: boolean,
    errorMessage: string
}

// bắt lỗi các component mà nó chứa
// quá trình rendering
// constructor
// lifecycle

// ko bắt được các lỗi
// event handle
// code bất đồng bộ
// server side rendering
// lỗi từ chính nó (ErrorBoundary)

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
    hasError: false,
    errorMessage: ''
}

public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error.toString() }
}

public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
}

public render() {
    if (this.state.hasError) {
        return(
            <>
            <Header />
                <SideNav />
                        <div className='content-wrapper'>
                            <section className="content-header">
                                <div className="container-fluid">
                                    <div className="row mb-2">
                                        <div className="col-sm-6">
                                            <h1>500 Error Page</h1>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="content">
                                <div className="error-page">
                                    <h2 className="headline text-danger">500</h2>
                                    <div className="error-content">
                                        <h3><i className="fas fa-exclamation-triangle text-danger" /> Oops! Something went wrong.</h3>
                                        <p>{this.state.errorMessage}</p>
                                        <p>
                                        We will work on fixing that right away.
                                        Meanwhile, you may <a href={path.home}>return to dashboard</a> or try using the search form.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                <Footer />
            </>
        )
    }
    return this.props.children;
}
}