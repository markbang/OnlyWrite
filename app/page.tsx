import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <header className='flex flex-col items-center justify-center bg-gray-100'>
        <h1 className='text-3xl font-bold underline'>Hello world!</h1>
        <Image
          src='/app-icon.svg'
          alt='Onlywrite app icon'
          width={100}
          height={100}
          priority
        />
        <p className='text-lg'>Welcome to Onlywrite app!</p>
      </header>
      <main className='flex flex-col items-center justify-between p-24'>
        <h2 className='text-2xl font-bold'>Get started</h2>
        <div className='flex flex-col items-center justify-center mt-4 space-y-2 underline'>
          <Button variant='default' className='w-48'>
            <a href='/docs/getting-started'>Getting Started</a>
          </Button>
          <Button variant='secondary' className='w-48'>
            <a href='/docs/api'>API Reference</a>
          </Button>
          <Button variant='link' className='w-48'>
            <a href='/login'>登录</a>
          </Button>
          <Button variant='outline' className='w-48'>
            <a href='/dashboard'>Dashboard</a>
          </Button>
        </div>
      </main>
      <footer className='flex items-center justify-center h-24 border-t'>
        <p className='text-sm text-gray-500'>
          &copy; {new Date().getFullYear()} Onlywrite. All rights reserved.
        </p>
      </footer>
    </>
  );
}
