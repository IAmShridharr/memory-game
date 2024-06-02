import MemoryGame from '../components/MemoryGame';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-amber-600">Memory Card Matching Game</h1>
      <MemoryGame />
    </div>
  );
}

export default Home;