import React from "react";

const BarInfo = () => {
  return (
    <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col max-md:mt-10">
        <div className="flex flex-col items-start px-7 py-8 w-full text-base text-gray-200 bg-neutral-800 min-h-[630px] max-md:px-5">
          <div className="text-2xl text-center text-amber-400">BarBuddy 1</div>
          <div className="flex flex-col self-stretch mt-6 w-full text-xs leading-5 max-w-[295px] text-stone-300">
            <div className="flex gap-2 items-center w-full">
              <div className="flex flex-1 shrink gap-1 justify-center items-center self-stretch my-auto w-full basis-0 min-w-[240px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a63d1909c1fa549f225ff011f34dbd2db62582341e27ad14a59097525fe63dd8?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
                  className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square fill-amber-400"
                  alt="Rating star"
                />
                <div className="self-stretch my-auto">
                  <span className="text-base leading-5 text-amber-400">
                    4.8{" "}
                  </span>
                  <span className="">(1.222)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch mt-6 w-full border border-amber-400 border-solid min-h-[1px]" />
          <div className="flex gap-4 py-0.5 mt-6 max-w-full leading-5 w-[273px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0228e7e4f4b880d85456e740ce77e07b01935221b43ea7d4a50204a71213b242?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 self-start w-5 aspect-square"
              alt="Location icon"
            />
            <div>87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1</div>
          </div>
          <div className="flex gap-4 py-px mt-6 max-w-full w-[230px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad3b97f0675fad092006248fcf64e39091b67e081ff7d88be356302831c14d1f?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 self-start w-5 aspect-square"
              alt="Clock icon"
            />
            <div>
              <span className="italic text-gray-200">
                Mở cửa - đóng cửa: 10:30{" "}
              </span>
              PM - <span className="italic text-gray-200">02:00 </span>AM
            </div>
          </div>
          <div className="flex gap-4 mt-6 max-w-full leading-7 w-[281px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/80a0905ae3e6166bd70cf1df30466a09ecb84fdb8f839af7a1abaf8baa6d71d2?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 self-start w-5 aspect-square"
              alt="Info icon"
            />
            <div className="grow shrink w-[242px]">
              Bar Buddy được thiết kế với lối kiến trúc cổ điển, lấy cảm hứng từ
              phong cách Tây Ban Nha với vẻ đẹp hoài cổ, độc đáo. Quán được xây
              dựng với những bức tường gạch thô gai góc, dùng ánh sáng màu đỏ và
              vàng rất huyền ảo. Không giống với những quán bar quận 1 khác
              thường thuê DJ chơi nhạc thì Carmen Bar lại thuê ban nhạc sống với
              những bài cực chill.
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start px-8 pt-4 pb-10 mt-16 max-w-full text-xs text-white rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] w-[327px] max-md:px-5 max-md:mt-10">
          <div className="self-center text-2xl font-bold text-center text-amber-400 text-opacity-90">
            Danh sách đã chọn
          </div>
          <div className="shrink-0 self-stretch mt-4 h-px border border-amber-400 border-solid" />
          <div className="flex gap-5 justify-between mt-4 ml-7 max-w-full leading-none w-[164px] max-md:ml-2.5">
            <div className="my-auto">Bàn VIP 1</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/60b2292fdddb88def1d62fba646def558e1bd6c427bf27025633c14ac4a99ae3?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 w-6 aspect-square"
              alt="Remove icon"
            />
          </div>
          <div className="flex gap-5 justify-between mt-4 ml-7 max-w-full leading-none w-[164px] max-md:ml-2.5">
            <div className="my-auto">Bàn VIP 2</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/51812d6802866701bf2622cc50e90965c73154b0179444920f4e837ef171755b?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 w-6 aspect-square"
              alt="Remove icon"
            />
          </div>
          <div className="flex gap-5 justify-between mt-4 ml-7 max-w-full leading-none w-[164px] max-md:ml-2.5">
            <div className="my-auto">Bàn SVIP 1</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e6bfb1c9bb668e0003209e3d1bc5e4da76500722f2c3fd7e1f117a916f579eb?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 w-6 aspect-square"
              alt="Remove icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarInfo;
