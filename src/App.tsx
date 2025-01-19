import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { ResumeForm } from '@/components/ResumeForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

function App() {
  const { theme, setTheme } = useTheme();

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <div className="min-h-screen bg-background">
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">AI Resume Builder</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </header>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Create Your Professional Resume
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Let AI help you craft a compelling resume that stands out.
                  Simply fill in your details, and we'll generate a professional
                  resume tailored to your experience.
                </p>
              </div>
              <ResumeForm />
            </div>
          </main>
        </ScrollArea>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;