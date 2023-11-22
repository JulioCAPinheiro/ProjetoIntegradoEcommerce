import HomeHeader from '@/components/HomeHeader';
import HomeStatus from '@/components/HomeStats';
import Layout from '@/components/Layout'


export default function Home() {
  return (
    <Layout>
      <HomeHeader/>
      <HomeStatus/>

    </Layout>
  )
}
