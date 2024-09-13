  import { Outlet } from 'react-router-dom'
  interface Props {
    children?: React.ReactNode
  }
  // nếu dùng children thì dùng được cho kiểu này (khai báo children ở element luôn)
  // element: (
  //   <RegisterLayout>
  //       <Login />
  //   </RegisterLayout>
  // )

  // nếu không dùng children thì chỉ dùng được cho kiểu này (tức element ko khai báo các children)
  // element: <RegisterLayout />,
  // children: [
  //     {
  //         path: '',
  //         element: <Register />
  //     }
  // ]

  // nói các khác
  // {children} đi kèm với element: (<A> <A1 /> </A>)
  // <Outlet /> đi kèm với children: [{}]
  export default function RegisterLayout({ children }: Props) {
    return (
      <div>
        {children}
        <Outlet />
      </div>
    )
  }