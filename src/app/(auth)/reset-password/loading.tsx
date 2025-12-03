export default function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md mx-auto'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-neutral-200 rounded w-3/4'></div>
            <div className='h-10 bg-neutral-200 rounded'></div>
            <div className='h-10 bg-neutral-200 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
