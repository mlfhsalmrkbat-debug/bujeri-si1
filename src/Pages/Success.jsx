const Success = () => {
  return (
    <div className="w-11/12 lg:w-1/2 flex flex-col items-center justify-center">
      <div className="main_bg w-full flex flex-col md:flex-row  items-center justify-center text-green-600 px-4 py-16 min-h-96">
        <div
          className="flex flex-col gap-y-2 md:items-end items-center md:py-2"
          dir="rtl "
        >
          <span className="text-3xl md:text-5xl ">تم تسجيل طلبكم بنجاح</span>
        </div>
      </div>
    </div>
  );
};

export default Success;
