import React from 'react';

const paymentOptions = [
    {
        name: 'Zalo Pay',
        image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b6de230e30188c5d04875d57ffe11a6e138f664832b7f795d5bdce10f18f60f9?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b',
        selected: false
    },
    {
        name: 'VN Pay',
        image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c3b795cf29370135614c954e43489801f8101bcc1075bab4929eafd629486f12?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b',
        selected: true
    }
];

function PaymentOption({ name, image, selected }) {
    return (
        <div className={`flex flex-col w-[140px] ${selected ? 'font-bold' : ''}`}>
            <div className={`flex justify-between items-center p-2 w-full rounded-xl ${selected ? 'border border-amber-400 border-solid bg-stone-900' : 'bg-zinc-900'}`}>
                <div className="flex gap-2 items-center self-stretch my-auto">
                    <img loading="lazy" src={image} alt={`${name} logo`} className="object-contain shrink-0 self-stretch my-auto rounded-lg aspect-[1.79] w-[50px]" />
                    <div className="self-stretch my-auto">{name}</div>
                </div>
            </div>
        </div>
    );
}

function PaymentMethod() {
    return (
        <section className="flex flex-col rounded-md items-start px-4 pt-2 pb-4 w-full bg-neutral-800 max-md:px-2 max-md:max-w-full">
            <h2 className="ml-2 text-xl leading-snug text-center text-amber-400 max-md:ml-1">
                Phương thức thanh toán
            </h2>
            <hr className="shrink-0 self-stretch mt-2 h-px border border-amber-400 border-solid max-md:max-w-full" />
            <div className="flex gap-2 items-start mt-4 text-sm leading-none text-zinc-100">
                {paymentOptions.map((option, index) => (
                    <PaymentOption key={index} {...option} />
                ))}
            </div>
        </section>
    );
}

export default PaymentMethod;