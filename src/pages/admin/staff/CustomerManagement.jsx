import React from 'react';
import Sidebar from './Sidebar';

function CustomerManagement() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <Sidebar />
        <div className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col mt-7 w-full max-md:max-w-full">
            <div className="flex flex-col px-12 w-full max-md:px-5 max-md:max-w-full">
              <header className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
                <h2 className="text-4xl font-bold text-sky-900 max-md:max-w-full">
                  QUẢN LÍ TÀI KHOẢN CUSTOMERS
                </h2>
                <div className="flex gap-6 items-center my-auto text-sm text-neutral-400">
                  <div className="flex gap-2 items-center self-stretch my-auto">
                    <form className="flex overflow-hidden gap-4 self-stretch p-2 my-auto border border-solid border-neutral-100 rounded-[40px] w-[181px]">
                      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f2fc090ae757125647393b21084c90b6686bcc5700a3d5cea5cf0c60f19cd91?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="" className="object-contain shrink-0 w-6 aspect-square" />
                      <input type="search" placeholder="Search everything" className="my-auto basis-auto bg-transparent border-none outline-none" />
                    </form>
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/21261a3e6e068e633078f20164f28789ae4f2cc8d85ba879de1ebf812eaec494?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="User profile" className="object-contain shrink-0 self-stretch my-auto w-10 shadow-sm aspect-square" />
                  </div>
                  <div className="shrink-0 self-stretch my-auto w-0 border border-solid bg-zinc-300 border-zinc-300 h-[30px]" />
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee42c39217971cc8672566b2d83730278f98f741e79a31ff46c5a171ac28ebac?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="Notifications" className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square" />
                </div>
              </header>
              <div className="flex gap-5 self-end mt-5 text-xl text-black max-md:mr-1.5">
                <div className="flex gap-10 py-2 pr-7 pl-2.5 bg-white rounded-md border border-black border-solid shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:pr-5">
                  <span>Filter by ALL</span>
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/f93fd95812aecf9ccc8e8e8f03e5a3b5506d64b3f9fc924cabbf68c9a242ea6d?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="" className="object-contain shrink-0 self-start mt-3.5 aspect-[1.93] w-[27px]" />
                </div>
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7292a80c97d0cf6d5b036f8662bd16d7651c99d56add58cd982e30d0f3ec69fe?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="Add new" className="object-contain shrink-0 w-12 rounded-md aspect-[1.07] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]" />
              </div>
              <section className="w-full">
                <div className="flex flex-wrap gap-10 px-16 pt-6 pb-9 mt-8 w-full text-xl font-bold text-black bg-neutral-200 max-md:px-5 max-md:max-w-full">
                  <div className="flex gap-10">
                    <div className="my-auto">Full Name</div>
                    <div className="basis-auto">Identity Card</div>
                    <div>Email</div>
                  </div>
                  <div className="flex gap-10 self-start whitespace-nowrap max-md:max-w-full">
                    <div>Created</div>
                    <div>Phone</div>
                    <div>Status</div>
                  </div>
                </div>
                {[
                  { name: "Nguyen Van A", identityCard: "123123123", email: "User@gmail.com", created: "Aug 18 2021", createdTime: "15:20:56", phone: "0906006699", status: "Active" },
                  { name: "Tran Van B", identityCard: "123123123", email: "User@gmail.com", created: "Jun 30 2021", createdTime: "19:50:01", phone: "0906006699", status: "Active" }
                ].map((customer, index) => (
                  <div key={index} className={index % 2 === 0 ? "flex flex-wrap gap-5 justify-between items-start px-16 pt-2.5 pb-7 max-w-full text-lg text-black bg-white w-[1321px] max-md:px-5 max-md:mr-1.5" : "flex flex-wrap gap-5 justify-between px-16 pt-3 pb-7 w-full text-lg text-black bg-stone-50 max-md:px-5 max-md:max-w-full"}>
                    <div className="flex gap-10 max-md:max-w-full">
                      <div className="my-auto">{customer.name}</div>
                      <div className="my-auto">{customer.identityCard}</div>
                      <div className="self-start mt-3.5 basis-auto">{customer.email}</div>
                      <div>
                        <span>{customer.created}</span>
                        <br />
                        <span className="text-black">{customer.createdTime}</span>
                      </div>
                      <div className="self-start">{customer.phone}</div>
                    </div>
                    <div className="flex gap-10 items-start mt-3 whitespace-nowrap">
                      <div>{customer.status}</div>
                      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/71090f307341fe93b3e98f218370e1742ae437f1f191edc47ad855866f3fdc31?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="" className="object-contain shrink-0 mt-1.5 w-2.5 aspect-[0.42]" />
                    </div>
                  </div>
                ))}
              </section>
              <nav className="flex gap-3 items-start self-end mr-6 mt-[558px] max-md:mt-10 max-md:mr-2.5" aria-label="Pagination">
                <div className="flex mt-1.5">
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/da564c2683807ab58a27bd500a992dfe36d5e0b0e2c9db091f6366ddee7c1145?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="First page" className="object-contain shrink-0 aspect-square w-[30px]" />
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d608bf349997fb030adb23f9e5bcd549758567fd3f8d9eab934fe214b3d0971a?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="Previous page" className="object-contain shrink-0 aspect-square w-[30px]" />
                </div>
                <div className="flex gap-3.5 items-start self-stretch text-3xl text-black whitespace-nowrap">
                  <button>1</button>
                  <button className="self-stretch px-3 pb-4 rounded-full bg-neutral-200 h-[38px] w-[38px]">2</button>
                  <span>...</span>
                </div>
                <div className="flex mt-1.5">
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ebd870cd7b0408d411056127dd70ef54c24ddc7bf1e3731ccfc188b310cdbc86?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="Next page" className="object-contain shrink-0 aspect-square w-[30px]" />
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1fce205f1c9d4e0a5e7bf5ad163a4eb472f9342e91e7ed8d58eb64b696d4ae6b?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="Last page" className="object-contain shrink-0 aspect-square w-[30px]" />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CustomerManagement;