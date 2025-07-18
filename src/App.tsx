import { useState } from 'react';
import { X, Eye, ExternalLink, Mail, Github, Linkedin, Menu, Download} from 'lucide-react';
import ThreeViewer from './components/ThreeViewer';

interface ModelItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  objUrl?: string;
  software: string[];
  year: string;
  cameraConfig?: {
    position?: [number, number, number];
    lookAt?: [number, number, number];
  };
}

const modelData: ModelItem[] = [
  {
    id: 1,
    title: "Desk Organizer",
    description: "Desk organizer for pens, clips & more",
    category: "Interior",
    objUrl: "/Objects/DeskOrganizer.obj",
    image: "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800",
    software: ["Fusion360", "BambuStudio"],
    year: "2024",
    cameraConfig: {
      position: [0, 0, 0],
      lookAt: [0, 0, 0],
    },
  },
  {
    id: 2,
    title: "Indoor Planter",
    description: "A sleek indoor planter with a built-in water reservoir for easy, low-maintenance plant care.",
    category: "Interior",
    objUrl: "/Objects/IndoorPlanter.obj",
    image: "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=800",
    software: ["Fusion360", "BambuStudio"],
    year: "2025",
    cameraConfig: {
      position: [0, 0, 0],
      lookAt: [0, 0, 0],
    },
  },
  {
    id: 3,
    title: "Spool Holder",
    description: "A compact spool holder with ball bearings for smooth rolling, perfect for desks or enclosure setups.",
    category: "3D Printing Accessories",
    objUrl: "/Objects/SpoolHolder.obj",
    image: "https://images.pexels.com/photos/7234258/pexels-photo-7234258.jpeg?auto=compress&cs=tinysrgb&w=800",
    software: ["Fusion360", "BambuStudio"],
    year: "2023",
    cameraConfig: {
      position: [0, 0, 0],
      lookAt: [0, 0, 0],
    },
  },
  {
    id: 4,
    title: "Water Filter",
    description: "Water tank filter that blocks large debris from entering",
    category: "Functional",
    objUrl: "/Objects/WaterTankFilter.obj",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800",
    software: ["Fusion360", "BambuStudio"],
    year: "2025",
    cameraConfig: {
      position: [0, 0, 0],
      lookAt: [0, 0, 0],
    },
  },
  {
    id: 5,
    title: "USW-Lite Holder",
    description: "19\" rack-mount holder for securely housing a Ubiquiti switch.",
    category: "Mounting Solutions",
    objUrl: "/Objects/UbiquitiSwitchHolder.obj",
    image: "https://images.pexels.com/photos/8828597/pexels-photo-8828597.jpeg?auto=compress&cs=tinysrgb&w=800",
    software: ["Fusion360", "BambuStudio"],
    year: "2025",
    cameraConfig: {
      position: [0, 0, 0],
      lookAt: [0, 0, 0],
    },
  },
  {
    id: 6,
    title: "UCG-Ultra Holder",
    description: "19\" rack-mount holder for securely housing a Ubiquiti router.",
    category: "Mounting Solutions",
    objUrl: "/Objects/UCG-Ultra-Case.obj",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    software: ["Fusion360", "BambuStudio"],
    year: "2025",
    cameraConfig: {
      position: [0, 0, 0],
      lookAt: [0, 0, 0],
    },
  }
];

function App() {
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(modelData.map(item => item.category)))];

  const filteredModels = selectedCategory === 'All' 
    ? modelData 
    : modelData.filter(model => model.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                3D Models Portfolio
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
                <a href="#portfolio" className="hover:text-blue-400 transition-colors">Portfolio</a>
                <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block px-3 py-2 text-base font-medium hover:text-blue-400 transition-colors">Home</a>
              <a href="#portfolio" className="block px-3 py-2 text-base font-medium hover:text-blue-400 transition-colors">Portfolio</a>
              <a href="#about" className="block px-3 py-2 text-base font-medium hover:text-blue-400 transition-colors">About</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              From Concept to 3D Creation
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Turning ideas into functional designs through 3D modeling and prototyping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#portfolio" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Eye className="h-5 w-5" />
                View Portfolio
              </a>
              <a 
                href="#contact" 
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Portfolio
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore my collection of 3D models, prototypes, and printable designs.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="group bg-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                      className="relative overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedModel(model)}
                    >
                      {model.objUrl ? (
                        <div className="w-full h-64 bg-gray-800">
                          <ThreeViewer 
                            objUrl={model.objUrl} 
                            className="w-full h-full"
                            showInstructions={false}
                            autoRotate={false}
                            cameraConfig={model.cameraConfig}                        
                          />
                        </div>
                      ) : (
                        <img
                          src={model.image}
                          alt={model.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300" />
                  </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-400 font-medium">{model.category}</span>
                    <span className="text-sm text-gray-400">{model.year}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{model.title}</h3>
                  <p className="text-gray-300 mb-4">{model.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {model.software.map((soft, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                      >
                        {soft}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                About Me
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                I'm a creative engineer with a passion for building both physical and digital projects.
                With a background in electrical engineering and embedded systems, I turn ideas into real, working
                prototypes—from smart devices and firmware to 3D models and web apps.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                I enjoy working across disciplines—designing PCBs, coding firmware, and shaping user experiences.
                Whether it’s printing a custom part or deploying a web app, I focus on practical solutions and
                clean, functional design.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-400">Skills</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 3D Modeling</li>
                    <li>• 3D Printing</li>
                    <li>• Functional Part Design</li>
                    <li>• Rapid Prototyping</li>
                    <li>• Tolerance Testing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-400">Software</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Fusion 360</li>
                    <li>• BambuStudio</li>
                    <li>• PrusaSlicer</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/Objects/AboutMeBackground.png"
                  alt="3D Artist Workspace"
                  className="rounded-xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to bring your vision to life? Let's collaborate on your next project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a
              href="mailto:alexbaris167@gmail.com"
              className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-700 transition-colors group"
            >
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">alexbaris167@gmail.com</p>
            </a>

            <a
              href="https://github.com/Pot4too"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-700 transition-colors group"
            >
              <Github className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">GitHub</h3>
              <p className="text-gray-300">View my code</p>
            </a>

            <a
              href="https://www.linkedin.com/in/alex-baris/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-700 transition-colors group"
            >
              <Linkedin className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">LinkedIn</h3>
              <p className="text-gray-300">Connect with me</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 3D Models Portfolio.</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedModel && (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
       onClick={() => setSelectedModel(null)} // closes when clicking outside
      >
       <div
          className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
        >
            <div className="relative">
              {selectedModel.objUrl ? (
                <div className="w-full h-64 sm:h-96 bg-gray-800 rounded-t-xl">
                  <ThreeViewer 
                    objUrl={selectedModel.objUrl} 
                    className="w-full h-full rounded-t-xl"
                    showInstructions={true}
                    autoRotate={true}
                    cameraConfig={selectedModel.cameraConfig}
                  />
                </div>
              ) : (
                <img
                  src={selectedModel.image}
                  alt={selectedModel.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-t-xl"
                />
              )}
              <button
                onClick={() => setSelectedModel(null)}
                className="absolute top-4 left-4 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-colors z-20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-400 font-medium">{selectedModel.category}</span>
                <span className="text-gray-400">{selectedModel.year}</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">{selectedModel.title}</h3>
              <p className="text-gray-300 mb-6">{selectedModel.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedModel.software.map((soft, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full"
                  >
                    {soft}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  View Details
                </button>
                <button className="flex-1 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;