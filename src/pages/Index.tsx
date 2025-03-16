
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ChevronRight, LineChart as LineChartIcon, TrendingUp, BarChart4, BrainCircuit } from "lucide-react";

// Sample data for decorative charts
const sampleData1 = Array.from({ length: 20 }, (_, i) => ({ 
  value: 50 + Math.random() * 50 + Math.sin(i / 3) * 20 
}));
const sampleData2 = Array.from({ length: 20 }, (_, i) => ({ 
  value: 30 + Math.random() * 30 + Math.cos(i / 2) * 15 
}));

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Index = () => {
  const features = [
    {
      icon: <LineChartIcon className="h-8 w-8 text-primary" />,
      title: "Historical Analysis",
      description: "View and analyze historical stock data with interactive charts"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Price Predictions",
      description: "Forecast future stock prices using advanced LSTM machine learning models"
    },
    {
      icon: <BarChart4 className="h-8 w-8 text-primary" />,
      title: "Performance Metrics",
      description: "Track prediction accuracy and performance over time"
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Get intelligent insights based on pattern recognition and technical analysis"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="lg:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.span 
            className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Stock Price Prediction LSTM 
          </motion.span>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Predict Stock Prices with <span className="text-primary">LSTM</span> Technology
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Get accurate stock price predictions using our advanced Long Short-Term Memory neural networks.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Button asChild size="lg" className="px-8">
              <Link to="/predict">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                Explore Dashboard
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative bg-gradient-to-tr from-primary/5 to-primary/20 rounded-2xl p-4 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm rounded-2xl -z-10"></div>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData1}>
                  <defs>
                    <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    fillOpacity={1}
                    fill="url(#gradientA)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <motion.div 
              className="absolute bottom-10 right-10 w-[120px] h-[80px] bg-white rounded-lg shadow-lg p-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData2}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ff6b6b" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="mb-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge machine learning with intuitive design to deliver
            accurate stock predictions and insightful analysis.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card p-6 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="bg-gradient-to-br from-primary/5 to-primary/20 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent,white)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
        />
        
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-4 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Ready to Predict the Future?
        </motion.h2>
        
        <motion.p 
          className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Start making data-driven investment decisions today with our stock prediction platform.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" className="px-8">
            <Link to="/predict">
              Try it Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
