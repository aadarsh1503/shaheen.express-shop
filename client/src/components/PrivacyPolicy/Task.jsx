import React, { useState } from 'react';
import EmailSection from '../Hero/EmailSection';
import { Link } from "react-router-dom";

// Collapsible Section Component
const CollapsibleSection = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-DarkBlue ">
      
      <div className="font-roboto lg:max-w-5xl bg-white mx-auto mb-4">
        
        {/* Header */}
        <div
          className="flex bg-YellowLight lg:px-4 outline-white border outline-1 lg:w-[1032px] lg:py-2 cursor-pointer items-center"
          onClick={toggleSection}
        >
          <div className="text-2xl  lg:mr-3">{isOpen ? '-' : '▼'}</div>
          <div className="font-bold text-dgreen text-xl">{title}</div>
        </div>
        {/* Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'h-full' : 'h-1'
          }`}
        >
          {isOpen && (
            <div className="text-start lg:mt-4 lg:px-8 border-yellow-400">
              <div className="p-4 font-roboto">{description}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Task = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="bg-dgreen font-sans text-white py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="lg:text-7xl text-2xl font-poppins font-bold mb-2">
            Privacy Policy
          </h1>
        </div>
      </div>
      <h1 className='max-w-6xl font-poppins lg:w-[1032px] mt-14 mx-auto'>
        <Link to="/privacy-policy" className="text-dgreen hover:underline">
        Kebijakan Privasi Terbaru
        </Link>{" "}
        -{" "}
      
          Riyawat Kebijakan Privasi

      </h1>
     
      {/* Collapsible Sections */}
      <div className="py-12 bg-DarkBlue font-roboto">
        <CollapsibleSection
          title="PENGANTAR"
          description={
            <>
             
              <p>
              Pemberitahuan Privasi berikut ini menjelaskan bagaimana Kami PT Swift Shipment Solutions dan/atau afiliasinya, termasuk namun tidak terbatas pada PT Paket Anak Bangsa dan/atau PT Swift Logistics Solutions dan/atau PT GoTo Solusi Niaga (“GTL”) memperoleh, mengumpulkan, menyimpan, menguasai, menggunakan, mengolah, menganalisa, memperbaiki, melakukan pembaruan, menampilkan, menguumkan, mentransfer, mengungkapkan dan melindungi Data Pribadi yang diproses oleh GTL (“Pemrosesan Data Pribadi”).
              </p>
              <br />
              <p>
              Pemberitahuan Privasi ini berlaku bagi seluruh pengguna aplikasi seluler dan/atau situs web (termasuk https://www.gtl.id) dan layanan, termasuk namun tidak terbatas pada layanan pengiriman dengan GTL dan pelaksanaan pemenuhan barang pesanan, jasa pengiriman barang dan pembelian barang pesanan (“Layanan”),
              </p>
              <br />
              <p>
              Pemberitahuan Privasi ini disediakan dalam format berlapis sehingga Anda dapat mengklik ke area tertentu yang tersedia di bawah ini. Harap baca Pemberitahuan Privasi ini secara menyeluruh untuk memastikan bahwa Anda memahami praktik perlindungan data Kami. Agar lebih mudah dimengerti, Kami sudah merangkum poin-poin pentingnya di bagian ringkasan. Kecuali ditentukan lain, semua istilah dalam huruf kapital yang digunakan dalam Pemberitahuan Privasi ini akan memiliki arti yang sama dengan istilah tersebut dalam Syarat dan Ketentuan yang berlaku antara Anda dan GTL.
              </p>
            </>
          }
        />

        <CollapsibleSection
          title="RINGKASAN"
          description={
            <>

              <p className=" mt-2 font-sans font-semibold">
               Data apa yang Kami proses?
              </p>
              <br />
              <p>
              Kami memproses Data Pribadi yang dibutuhkan untuk menyediakan Layanan sebagai Pemroses Data. Data Pribadi ini merupakan yang Kami terima dari pihak yang mengumpulkan Data Pribadi (“Klien”) dan memberikannya kepada Kami untuk kepentingan pemberian Layanan.
              </p>
              <p className=" mt-2 font-sans font-semibold">
              Bagaimana Kami menggunakan data?
              </p>
              <br />
              <p>
              Setelah Kami menerima Data Pribadi dari Klien Kami, Kami menggunakan Data Pribadi yang Kami terima tersebut untuk mengelola dan mengatur, berkomunikasi dengan pengirim, memenuhi pesanan atas barang dan penerimaan barang, dan yang paling penting adalah untuk menyediakan Layanan.
              </p>
              <p className=" mt-2 font-sans font-semibold">
              Dengan siapa Kami membagi data?
              </p>
              <br />
              <p>
              Apabila diperlukan, Kami mungkin dapat membagikan Data Pribadi yang Kami terima dari Klien Kami dengan pihak lain yang tentunya memiliki kerja sama dengan Kami untuk penyelenggaraan Layanan, contohnya adalah para mitra logistik Kami.
              </p>
              <p className=" mt-2 font-sans font-semibold">
              Berapa lama Kami menyimpan data?
              </p>
              <br />
              <p>
              Kami memproses Data Pribadi sesuai dengan instruksi dari Klien Kami atau sebagaimana diwajibkan oleh hukum yang berlaku.
              </p>
              <p className=" mt-2 font-sans font-semibold">
              Bagaimana cara subyek data untuk melaksanakan hak atas data pribadinya?
              </p>
              <br />
              <p>
              Apabila subyek data hendak melaksanakan hak atas data pribadinya, Kami dapat mengarahkan subyek data untuk menghubungi Klien terkait Kami. Kami akan melaksanakan permintaan pemenuhan hak subyek data berdasarkan instruksi yang Kami terima dari Klien terkait Kami.
              </p>
              <p className=" mt-2 font-sans font-semibold">
              Hubungi Kami
              </p>
              <br />
              <p>
              Apabila Anda memiliki pertanyaan, perhatian atau keluhan, dapat menghubungi Kami melalui rincian kontak yang dapat ditemukan pada bagian Hubungi Kami.
              </p>
              <p className=" mt-2 font-sans font-semibold">
              Bagaimana Kami akan memberitahukan Anda terkait perubahan?
              </p>
              <br />
              <p>
              Kami akan mengubah Pemberitahuan Privasi ini dari waktu ke waktu dan memberikan pemberitahuan melalui situs web Kami.
              </p>
              <br />
              <p>
              Penjelasan lebih lanjut tentang hal di atas dapat dibaca pada bagian di bawah ini.
              </p>
              {/* Add other terms here as needed */}
            </>
          }
        />

        <CollapsibleSection
          title="DATA PRIBADI APA YANG KAMI PROSES"
          description={
            <>
              <p className="font-sans mt-2 font-semibold">
              1. Jenis-jenis Data Pribadi Yang Kami Proses
              </p>
              <br />
              <p>
              “Data Pribadi” berarti informasi yang mengidentifikasi atau dapat digunakan untuk mengidentifikasi, menghubungi, atau menemukan orang atau perangkat yang terkait dengan informasi tersebut. Data Pribadi termasuk, namun tidak terbatas pada, nama, alamat, nomor telepon. Selain itu, sejauh informasi lain, termasuk profil pribadi, dan/atau pengenal unik, dikaitkan atau digabungkan dengan Data Pribadi, maka data tersebut juga merupakan Data Pribadi.
              </p>
              <br />
              <p>
              Jenis Data Pribadi yang Kami proses sesuai dengan yang Kami butuhkan untuk menyediakan Layanan, sebagai Pemroses Data.
              </p>
              <br />
              <p>
              Sepanjang diizinkan oleh peraturan perundang-undangan yang berlaku dan sesuai instruksi dari klien Kami, Kami dapat memproses, jenis-jenis berbeda dari Data Pribadi, yang telah Kami kategorikan sebagai berikut:              </p>
          <br />
          <p>a. Data Identitas termasuk nama pemesan barang, nama pengirim barang dan penerima barang.</p>
           <p>b. Data Kontak termasuk alamat pengirim barang dan penerima barang; nomor telepon dan/atau nomor hp pengirim barang dan penerima barang.</p>
           <p>c. Data Lokasi termasuk informasi lokasi geografis pengirim, titik koordinat, live location dan penerima barang.</p>
           <br />
           <p className="font-sans mt-2 font-semibold">
              2. Jika klien menyediakan Data Pribadi yang tidak lengkap
              </p>
              <br />
              <p>Jika Kami perlu memproses Data Pribadi berdasarkan hukum, atau berdasarkan ketentuan sebuah perjanjian yang Kami miliki dengan Klien, dan Klien memilih untuk tidak menyediakan Data Pribadi tersebut atau menyediakan Data Pribadi yang tidak lengkap, Kami mungkin tidak dapat menyediakan layanan dan melaksanakan perjanjian yang Kami miliki atau sedang dalam proses untuk disepakati dengan Klien.</p>
              <br />
              <p>Kami akan memproses Data Pribadi sebagaimana adanya (as is) yang disediakan kepada kami. Klien bertanggung jawab untuk melakukan verifikasi dan memastikan akurasi Data Pribadi yang disediakan kepada Kami.</p>
  
              <p className="font-sans mt-2 font-semibold">
              3. Bagaimana Kami Mengumpulkan Data Pribadi Anda
              </p>
              <br />
              <p>Data Pribadi yang Kami proses untuk keperluan pelaksanaan Layanan Kami peroleh langsung dari Klien Kami. Kami juga melakukan pengumpulan Data Pribadi untuk memproses ketertarikan penggunaan Layanan atau keluhan melalui situs kami dan/atau kami terima melalui email layanan pelanggan yang telah kami sediakan.</p>
               
              <p className="font-sans mt-2 font-semibold">
              4. Bagaimana subjek data melaksanakan haknya terhadap datanya?
              </p>
              <br />
              <p>Pengirim dan penerima barang, sebagai subjek data, mungkin memiliki berbagai hak sehubungan dengan Data Pribadi mereka berdasarkan hukum yang berlaku .</p>
  <br />
             
             <p>Pengirim dan penerima barang, sebagai subjek data, mungkin memiliki berbagai hak sehubungan dengan Data Pribadi mereka berdasarkan hukum yang berlaku.</p>
             <br />
  <p>Kami dapat mengarahkan untuk menghubungi Klien terkait, agar mereka dapat menyampaikan permintaan pelaksanaan hak mereka secara langsung kepada Klien Kami.</p>
  </>
          }
        />

        <CollapsibleSection
          title="BAGAIMANA KAMI MEMPROSES DATA PRIBADI ANDA"
          description={
            <>
              <p className=" mt-2 font-semibold">
              5- Penggunaan Data Pribadi yang Kami terima
              </p>
              <p>
              Kami dapat menggunakan Data Pribadi yang Kami terima dari klien untuk tujuan sebagai berikut maupun untuk tujuan lain yang diizinkan oleh peraturan perundang-undangan yang berlaku dan instruksi dari klien ("Tujuan"):
              </p>
              <br />
              <li>untuk memungkinkan penyedia layanan sesuai dengan instruksi dari klien;</li>
              <br />
              <li>untuk memproses dan memfasilitasi pengiriman barang sesuai dengan instruksi dan permintaan yang Kami terima dari klien Kami;</li>
              <br />
              <li>untuk berkomunikasi dengan pengirim dan penerima barang;

</li>
              <br />
              <li>untuk memberi tahu pengirim, penerima, dan klien tentang setiap pembaruan terkait Layanan;</li>
              <br />
              <li>untuk memproses dan menanggapi pertanyaan dan umpan balik yang diterima dari pengirim, penerima, dan klien</li>
              <br />
              <li>untuk memproses segala bentuk permintaan, aktivitas maupun pertanyaan yang dilakukan oleh pengguna Layanan;</li>
              <br />
              <li>untuk penyediaan fitur-fitur untuk memberikan, mewujudkan, memelihara dan memperbaiki Layanan;</li>
              <br />
              <li>untuk berkomunikasi dengan pengguna Layanan;

</li>
              <br />
              <li>untuk memberikan layanan pelanggan sehubungan dengan Layanan;</li>
              <br />
              <li>untuk mengembangkan Layanan;</li>
              <br />
              <li>untuk memenuhi kewajiban hukum Kami misalkan berdasarkan ketentuan hukum dan perundangan Kami wajib untuk memberikan Data Pribadi; dan</li>
              <br />
              <li>untuk menegakan hak Kami dalam hal apa yang pengguna lakukan pada situs atau aplikasi atau Layanan merugikan Kami, seperti merusak situs, atau aplikasi atau Layanan, mengirimkan permintaan layanan palsu, menipu Kami atau pengguna Layanan, dan berbagai macam tindakan atau percobaan tindakan kriminalitas sehubungan dengan Layanan.</li>
              <br />
              <p className=" mt-2 font-semibold">
              6- Pemberian Data Pribadi yang Kami Kumpulkan
              </p>
              <br />
              <p>Kami dapat mengungkapkan atau membagikan Data Pribadi dengan afiliasi dan pihak lain (termasuk agen, vendor, penyedia barang/jasa, mitra dan pihak lainnya yang menyediakan jasa untuk Kami atau Anda, melaksanakan fungsi tertentu atas nama Kami atau pihak lain yang memiliki kerja sama komersial dengan Kami) untuk tujuan sebagai berikut ini serta untuk tujuan lain yang diizinkan oleh peraturan perundang-undangan yang berlaku dan sesuai dengan instruksi dari Klien Kami:</p>
              <br />
              <li>jika dibutuhkan untuk menyediakan Layanan, termasuk namun tidak terbatas untuk berkomunikasi dengan pengirim dan penerima barang;</li>          
              <br />
              <li>jika disyaratkan atau diotorisasikan oleh peraturan perundang-undangan yang berlaku (termasuk namun tidak terbatas pada, menanggapi pertanyaan terkait regulasi, penyelidikan atau pedoman, atau mematuhi persyaratan atau ketentuan pengarsipan pelaporan, dan perizinan berdasarkan undang-undang), untuk tujuan yang ditentukan dalam peraturan perundang-undangan yang berlaku;

</li>      
              <br />
              <li>jika diinstruksikan, diminta, disyaratkan atau diperbolehkan oleh pemerintah yang berwenang, untuk tujuan sebagaimana disebutkan dalam kebijakan pemerintah, peraturan atau peraturan perundang-undangan yang berlaku.</li>      
              <br />
              <li>jika terdapat proses hukum dalam bentuk apapun antara, sehubungan dengan, atau terkait dengan layanan, untuk keperluan proses hukum tersebut;</li>      
              <br />
              <li>dalam keadaan darurat terkait keselamatan Anda untuk keperluan menangani keadaan darurat tersebut;</li>      
              <br />
              <li>dalam situasi terkait kesehatan atau kepentingan umum, Kami dapat membagikan Data Pribadi Anda kepada pemerintah yang berwenang dan/atau institusi lainnya yang dapat ditunjuk oleh pemerintah yang berwenang atau memiliki kerja sama dengan Kami, untuk tujuan pelacakan kontak, mendukung inisiatif, kebijakan atau program pemerintah, kesehatan publik dan tujuan lainnya sebagaimana dibutuhkan secara wajar;</li>      
              <br />
              <li>sehubungan dengan proses klaim asuransi, Kami akan membagikan Data Pribadi untuk tujuan pemrosesan klaim asuransi kepada perusahaan asuransi;</li>      
              <br />


            </>
          }
        />




        
<CollapsibleSection
          title="BAGAIMANA KAMI MELINDUNGI DATA PRIBADI ANDA"
          description={
            <>
              <p className=" mt-2 font-semibold">
              5- Penggunaan Data Pribadi yang Kami terima
              </p>
              <p>
              Kami dapat menggunakan Data Pribadi yang Kami terima dari klien untuk tujuan sebagai berikut maupun untuk tujuan lain yang diizinkan oleh peraturan perundang-undangan yang berlaku dan instruksi dari klien ("Tujuan"):
              </p>
              <br />
              <li>untuk memungkinkan penyedia layanan sesuai dengan instruksi dari klien;</li>
              <br />
              <li>untuk memproses dan memfasilitasi pengiriman barang sesuai dengan instruksi dan permintaan yang Kami terima dari klien Kami;</li>
              <br />
              <li>untuk berkomunikasi dengan pengirim dan penerima barang;

</li>
              <br />
              <li>untuk memberi tahu pengirim, penerima, dan klien tentang setiap pembaruan terkait Layanan;</li>
              <br />
              <li>untuk memproses dan menanggapi pertanyaan dan umpan balik yang diterima dari pengirim, penerima, dan klien</li>
              <br />
              <li>untuk memproses segala bentuk permintaan, aktivitas maupun pertanyaan yang dilakukan oleh pengguna Layanan;</li>
              <br />
              <li>untuk penyediaan fitur-fitur untuk memberikan, mewujudkan, memelihara dan memperbaiki Layanan;</li>
              <br />
              <li>untuk berkomunikasi dengan pengguna Layanan;

</li>
              <br />
              <li>untuk memberikan layanan pelanggan sehubungan dengan Layanan;</li>
              <br />
              <li>untuk mengembangkan Layanan;</li>
              <br />
              <li>untuk memenuhi kewajiban hukum Kami misalkan berdasarkan ketentuan hukum dan perundangan Kami wajib untuk memberikan Data Pribadi; dan</li>
              <br />
              <li>untuk menegakan hak Kami dalam hal apa yang pengguna lakukan pada situs atau aplikasi atau Layanan merugikan Kami, seperti merusak situs, atau aplikasi atau Layanan, mengirimkan permintaan layanan palsu, menipu Kami atau pengguna Layanan, dan berbagai macam tindakan atau percobaan tindakan kriminalitas sehubungan dengan Layanan.</li>
              <br />
              <p className=" mt-2 font-semibold">
              6- Pemberian Data Pribadi yang Kami Kumpulkan
              </p>
              <br />
              <p>Kami dapat mengungkapkan atau membagikan Data Pribadi dengan afiliasi dan pihak lain (termasuk agen, vendor, penyedia barang/jasa, mitra dan pihak lainnya yang menyediakan jasa untuk Kami atau Anda, melaksanakan fungsi tertentu atas nama Kami atau pihak lain yang memiliki kerja sama komersial dengan Kami) untuk tujuan sebagai berikut ini serta untuk tujuan lain yang diizinkan oleh peraturan perundang-undangan yang berlaku dan sesuai dengan instruksi dari Klien Kami:</p>
              <br />
              <li>jika dibutuhkan untuk menyediakan Layanan, termasuk namun tidak terbatas untuk berkomunikasi dengan pengirim dan penerima barang;</li>          
              <br />
              <li>jika disyaratkan atau diotorisasikan oleh peraturan perundang-undangan yang berlaku (termasuk namun tidak terbatas pada, menanggapi pertanyaan terkait regulasi, penyelidikan atau pedoman, atau mematuhi persyaratan atau ketentuan pengarsipan pelaporan, dan perizinan berdasarkan undang-undang), untuk tujuan yang ditentukan dalam peraturan perundang-undangan yang berlaku;

</li>      
              <br />
              <li>jika diinstruksikan, diminta, disyaratkan atau diperbolehkan oleh pemerintah yang berwenang, untuk tujuan sebagaimana disebutkan dalam kebijakan pemerintah, peraturan atau peraturan perundang-undangan yang berlaku.</li>      
              <br />
              <li>jika terdapat proses hukum dalam bentuk apapun antara, sehubungan dengan, atau terkait dengan layanan, untuk keperluan proses hukum tersebut;</li>      
              <br />
              <li>dalam keadaan darurat terkait keselamatan Anda untuk keperluan menangani keadaan darurat tersebut;</li>      
              <br />
              <li>dalam situasi terkait kesehatan atau kepentingan umum, Kami dapat membagikan Data Pribadi Anda kepada pemerintah yang berwenang dan/atau institusi lainnya yang dapat ditunjuk oleh pemerintah yang berwenang atau memiliki kerja sama dengan Kami, untuk tujuan pelacakan kontak, mendukung inisiatif, kebijakan atau program pemerintah, kesehatan publik dan tujuan lainnya sebagaimana dibutuhkan secara wajar;</li>      
              <br />
              <li>sehubungan dengan proses klaim asuransi, Kami akan membagikan Data Pribadi untuk tujuan pemrosesan klaim asuransi kepada perusahaan asuransi;</li>      
              <br />


            </>
          }
        />
        <CollapsibleSection
          title="APA SAJA HAK-HAK ANDA"
          description={
            <>
              <p className=" mt-2 font-semibold">
              10- Akses dan Koreksi Data Pribadi
              </p>
              <p>
              Pengirim dan penerima barang, sebagai subjek data, mungkin memiliki hak tertentu berdasarkan hukum yang berlaku untuk meminta Kami mengakses, mengoreksi, dan/atau menghapus Data Pribadi mereka yang saat ini Kami proses. Sejauh hak-hak ini tersedia berdasarkan hukum yang berlaku, mereka dapat menggunakan hak-hak ini dengan menghubungi Kami di rincian yang disediakan di bagian di bawah ini dan Kami dapat membantu dengan mengarahkan mereka kepada Klien terkai agar mereka dapat menghubungi Klien Kami secara langsung.
              </p>
              <br />
              <p>Kami dapat menolak permintaan terhadap akses pada, koreksi dari dan/atau penghapusan terhadap, sebagian atau semua Data Pribadi yang Kami proses jika diperbolehkan atau diperlukan berdasarkan peraturan perundang-undangan yang berlaku. Hal ini termasuk dalam keadaan di mana Data Pribadi tersebut dapat berisi referensi kepada orang lain atau di mana permintaan untuk akses atau permintaan untuk mengoreksi atau menghapus adalah untuk alasan yang Kami anggap tidak relevan, tidak serius, atau mengada-ada atau terindikasi terkait tindakan pelanggaran ketentuan penggunaan atau dengan aktivitas atau pelanggaran hukum.</p>
              


            </>
          }
        />
        <CollapsibleSection
          title="LAIN-LAIN"
          description={
            <>
              <p className=" mt-2 font-semibold">
              11. Perubahan atas Pemberitahuan Privasi Ini
              </p>
              <br />
              <p>
              Kami dapat meninjau dan mengubah Pemberitahuan Privasi ini atas kebijakan Kami sendiri dari waktu ke waktu, untuk memastikan bahwa Pemberitahuan Privasi ini konsisten dengan perkembangan Kami di masa depan, dan/atau perubahan persyaratan hukum atau peraturan. Jika Kami memutuskan untuk mengubah Pemberitahuan Privasi ini, Kami akan memberitahu Anda tentang perubahan tersebut melalui pemberitahuan umum yang dipublikasikan pada situs.
              </p>
              <br />
            </>
          }
        />
         <CollapsibleSection
          title="HUBUNGI KAMI"
          description={
            <>
              <p className=" mt-2 font-semibold">
              12. Hubungi Kami
              </p>
              <br />
              <p>
              Jika Anda memiliki pertanyaan mengenai Pemberitahuan Privasi ini atau Anda ingin mendapatkan akses, meminta penghapusan, melakukan koreksi dan/atau hak-hak lainnya terhadap Data Pribadi anda, silahkan hubungi dataprivacy.dpo@gtl.id.
              </p>
              <br />
            </>
          }
        />
        
          <CollapsibleSection
          title="Riwayat Kebijakan Privasi"
          description={
            <>
              <li className=" mt-2 font-semibold">
              Kebijakan Privasi - 01/09/2021
              </li>
              <br />
              
              <br />
            </>
          }
        />
      </div>

      {/* Email Section */}
      <EmailSection />
    </div>
  );
};

export default  Task;
