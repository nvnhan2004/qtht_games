import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../contexts/app.context";

type ChiSoTrongThang = {
  thu_nhap_trong_thang: number
  chi_tieu_trong_thang: number
  so_du_trong_thang: number
  thu_nhap_trong_nam: number
  chi_tieu_trong_nam: number
  so_du_trong_nam: number
}

const initChiSoTrongThang = {
  thu_nhap_trong_thang: 0,
  chi_tieu_trong_thang: 0,
  so_du_trong_thang: 0,
  thu_nhap_trong_nam: 0,
  chi_tieu_trong_nam: 0,
  so_du_trong_nam: 0
}

export default function Home(){
  
  const { profile } = useContext(AppContext)
  // const [chiSoTrongThang, setChiSoTrongThang] = useState(initChiSoTrongThang);
  // const { data: fetchedChiSoTrongThang } = useQuery({
  //   queryKey: ['chiSoTrongThang'],
  //   queryFn: () => dashboardApi.getChiSoTrongThang(profile?.id)
  // });

  // useEffect(() => {
  //   if (fetchedChiSoTrongThang) {
  //     setChiSoTrongThang(fetchedChiSoTrongThang?.data);
  //   }
  // }, [fetchedChiSoTrongThang]);

  return(
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Tổng quan</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            
          </div>
        </section>
      </div>
    </div>
  )
}