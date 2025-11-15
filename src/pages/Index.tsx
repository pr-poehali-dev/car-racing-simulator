import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Car {
  id: number;
  name: string;
  brand: string;
  image: string;
  maxSpeed: number;
  acceleration: number;
  handling: number;
  power: string;
}

const cars: Car[] = [
  {
    id: 1,
    name: 'Aventador SVJ',
    brand: 'Lamborghini',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=95',
    maxSpeed: 350,
    acceleration: 9.8,
    handling: 9.5,
    power: '770 HP'
  },
  {
    id: 2,
    name: '911 GT3 RS',
    brand: 'Porsche',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=95',
    maxSpeed: 320,
    acceleration: 9.2,
    handling: 10,
    power: '520 HP'
  },
  {
    id: 3,
    name: 'SF90 Stradale',
    brand: 'Ferrari',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=95',
    maxSpeed: 340,
    acceleration: 10,
    handling: 9.3,
    power: '1000 HP'
  }
];

export default function Index() {
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(1);
  const [isDriving, setIsDriving] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);

  const handleAccelerate = useCallback(() => {
    setIsAccelerating(true);
    setIsDriving(true);
  }, []);

  const handleBrake = useCallback(() => {
    setIsBraking(true);
  }, []);

  const handleRelease = useCallback(() => {
    setIsAccelerating(false);
    setIsBraking(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prevSpeed => {
        let newSpeed = prevSpeed;
        
        if (isAccelerating && newSpeed < selectedCar.maxSpeed) {
          const acceleration = selectedCar.acceleration * 0.5;
          newSpeed = Math.min(prevSpeed + acceleration, selectedCar.maxSpeed);
        } else if (isBraking && newSpeed > 0) {
          newSpeed = Math.max(prevSpeed - 8, 0);
        } else if (!isAccelerating && !isBraking && newSpeed > 0) {
          newSpeed = Math.max(prevSpeed - 2, 0);
        }

        if (newSpeed === 0) {
          setIsDriving(false);
          setGear(1);
        } else {
          if (newSpeed > 60 && newSpeed <= 120) setGear(2);
          else if (newSpeed > 120 && newSpeed <= 180) setGear(3);
          else if (newSpeed > 180 && newSpeed <= 240) setGear(4);
          else if (newSpeed > 240 && newSpeed <= 300) setGear(5);
          else if (newSpeed > 300) setGear(6);
        }

        return newSpeed;
      });

      setRpm(prevRpm => {
        if (isAccelerating) {
          return Math.min(prevRpm + 200, 8000);
        } else if (isBraking) {
          return Math.max(prevRpm - 400, 1000);
        } else {
          return Math.max(prevRpm - 150, isDriving ? 1500 : 0);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAccelerating, isBraking, selectedCar, isDriving]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        handleAccelerate();
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        handleBrake();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        handleRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleAccelerate, handleBrake, handleRelease]);

  return (
    <div className="min-h-screen bg-garage">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-garage-dark/50 to-garage-dark"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-2 font-racing tracking-wider">
            ГАРАЖ
          </h1>
          <p className="text-gray-400 text-lg">Выберите автомобиль и почувствуйте мощь</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {cars.map(car => (
            <Card 
              key={car.id}
              className={`bg-garage-panel border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-garage-accent ${
                selectedCar.id === car.id ? 'border-garage-accent shadow-accent-glow' : 'border-gray-800'
              }`}
              onClick={() => setSelectedCar(car)}
            >
              <div className="relative overflow-hidden rounded-t-lg h-48">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                {selectedCar.id === car.id && (
                  <div className="absolute top-4 right-4 bg-garage-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                    ВЫБРАНО
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-1">{car.brand}</p>
                <h3 className="text-2xl font-bold text-white mb-4 font-racing">{car.name}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Макс. скорость</span>
                      <span className="text-white font-bold">{car.maxSpeed} км/ч</span>
                    </div>
                    <Progress value={(car.maxSpeed / 400) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Ускорение</span>
                      <span className="text-white font-bold">{car.acceleration}/10</span>
                    </div>
                    <Progress value={car.acceleration * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Управляемость</span>
                      <span className="text-white font-bold">{car.handling}/10</span>
                    </div>
                    <Progress value={car.handling * 10} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Icon name="Zap" className="text-garage-accent" size={20} />
                    <span className="text-garage-accent font-bold text-lg">{car.power}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-garage-panel border-2 border-gray-800 p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden mb-4 shadow-2xl">
                <img 
                  src={selectedCar.image} 
                  alt={selectedCar.name}
                  className={`w-full h-96 object-cover transition-transform duration-300 ${
                    isDriving ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    filter: isDriving ? 'blur(1px) brightness(1.1)' : 'none'
                  }}
                />
                {isDriving && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-in-right"></div>
                )}
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">{selectedCar.brand}</p>
                <h2 className="text-4xl font-bold text-white font-racing">{selectedCar.name}</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
                <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                  <Icon name="Gauge" className="text-garage-accent" size={24} />
                  ПРИБОРНАЯ ПАНЕЛЬ
                </h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-garage-accent mb-2 font-racing">
                      {Math.round(speed)}
                    </div>
                    <div className="text-gray-400 text-sm">КМ/Ч</div>
                    <Progress 
                      value={(speed / selectedCar.maxSpeed) * 100} 
                      className="h-3 mt-3"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2 font-racing">
                      {Math.round(rpm)}
                    </div>
                    <div className="text-gray-400 text-sm">RPM</div>
                    <Progress 
                      value={(rpm / 8000) * 100} 
                      className="h-3 mt-3"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/50 rounded-lg p-4 mb-6">
                  <span className="text-gray-400">ПЕРЕДАЧА</span>
                  <span className="text-5xl font-bold text-garage-accent font-racing">{gear}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-black/50 rounded p-3 text-center">
                    <Icon name="Zap" className="text-garage-accent mx-auto mb-1" size={20} />
                    <div className="text-white font-bold">{selectedCar.power}</div>
                  </div>
                  <div className="bg-black/50 rounded p-3 text-center">
                    <Icon name="Gauge" className="text-garage-accent mx-auto mb-1" size={20} />
                    <div className="text-white font-bold">{selectedCar.maxSpeed} км/ч</div>
                  </div>
                  <div className="bg-black/50 rounded p-3 text-center">
                    <Icon name="Timer" className="text-garage-accent mx-auto mb-1" size={20} />
                    <div className="text-white font-bold">{selectedCar.acceleration}/10</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="bg-garage-accent hover:bg-garage-accent/80 text-white font-bold h-16 text-lg"
                  onMouseDown={handleAccelerate}
                  onMouseUp={handleRelease}
                  onMouseLeave={handleRelease}
                  onTouchStart={handleAccelerate}
                  onTouchEnd={handleRelease}
                >
                  <Icon name="ArrowUp" size={24} className="mr-2" />
                  ГАЗ
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-garage-accent text-garage-accent hover:bg-garage-accent/20 font-bold h-16 text-lg"
                  onMouseDown={handleBrake}
                  onMouseUp={handleRelease}
                  onMouseLeave={handleRelease}
                  onTouchStart={handleBrake}
                  onTouchEnd={handleRelease}
                >
                  <Icon name="ArrowDown" size={24} className="mr-2" />
                  ТОРМОЗ
                </Button>
              </div>

              <div className="text-center text-gray-400 text-sm">
                <p>Управление: ↑/W - газ, ↓/S - тормоз</p>
                <p className="mt-1">Или используйте кнопки выше</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
