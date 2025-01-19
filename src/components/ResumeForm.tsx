import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, FileDown, Wand2, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateResume, generateJobDescription } from '@/lib/gemini';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  experience: z.string().min(10, 'Experience must be at least 10 characters'),
  education: z.string().min(10, 'Education must be at least 10 characters'),
  skills: z.string().min(5, 'Skills must be at least 5 characters'),
  jobTitle: z.string().optional(),
  summary: z.string().optional(),
});

export function ResumeForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const watchJobTitle = watch('jobTitle', '');

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      
      let jobDescription = '';
      if (data.jobTitle) {
        jobDescription = await generateJobDescription(data.jobTitle, '5');
      }

      const prompt = `
        Create a professional resume in ${selectedTemplate} style for:
        Name: ${data.fullName}
        Email: ${data.email}
        Phone: ${data.phone}
        Job Title: ${data.jobTitle || 'Professional'}
        Summary: ${data.summary || ''}
        Experience: ${data.experience}
        Education: ${data.education}
        Skills: ${data.skills}
        ${jobDescription ? `Relevant Job Description: ${jobDescription}` : ''}
        
        Format the resume with the following requirements:
        1. Use clean, professional formatting
        2. Add appropriate spacing between sections
        3. Use semantic HTML with proper heading levels
        4. Include Font Awesome icons for section headers
        5. Style it according to the selected template (${selectedTemplate})
        6. Make it printer-friendly
        7. Ensure all text is properly aligned
        8. Add subtle visual hierarchy
        
        Return the resume as properly formatted HTML with embedded CSS for printing.
      `;

      const content = await generateResume(prompt);
      const enhancedContent = `
        <style>
          @media print {
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #000;
              margin: 0;
              padding: 20px;
            }
            h1 { font-size: 24px; color: #2c3e50; margin-bottom: 10px; }
            h2 { font-size: 20px; color: #34495e; margin-top: 20px; }
            h3 { font-size: 16px; color: #2c3e50; }
            .section { margin-bottom: 20px; }
            .contact-info { color: #666; margin-bottom: 15px; }
            .experience-item { margin-bottom: 15px; }
            .skills-list { columns: 2; column-gap: 20px; }
            .page-break { page-break-before: always; }
            a { color: #2c3e50; text-decoration: none; }
          }
        </style>
        ${content}
      `;
      setGeneratedContent(enhancedContent);
      toast({
        title: 'Resume generated successfully!',
        description: 'Your resume is ready to download.',
      });
    } catch (error) {
      toast({
        title: 'Error generating resume',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    try {
      toast({
        title: 'Preparing download...',
        description: 'Your PDF is being generated.',
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${watch('fullName')}-resume.pdf`);

      toast({
        title: 'Download complete!',
        description: 'Your resume has been saved as a PDF.',
      });
    } catch (error) {
      toast({
        title: 'Error downloading PDF',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Edit Resume</TabsTrigger>
          <TabsTrigger value="preview">Preview & Download</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="p-6">
            <div className="mb-6">
              <Label>Template Style</Label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input {...register('fullName')} className="mt-1" />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Desired Job Title</Label>
                  <Input {...register('jobTitle')} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input {...register('email')} type="email" className="mt-1" />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input {...register('phone')} className="mt-1" />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  {...register('summary')}
                  className="mt-1"
                  placeholder="Brief overview of your professional background and career goals"
                />
              </div>

              <div>
                <Label htmlFor="experience">Professional Experience</Label>
                <Textarea
                  {...register('experience')}
                  className="mt-1"
                  placeholder="List your work experience with company names, dates, and key achievements"
                />
                {errors.experience && (
                  <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  {...register('education')}
                  className="mt-1"
                  placeholder="List your educational background with institutions, degrees, and dates"
                />
                {errors.education && (
                  <p className="text-sm text-red-500 mt-1">{errors.education.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  {...register('skills')}
                  className="mt-1"
                  placeholder="List your technical and soft skills"
                />
                {errors.skills && (
                  <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setGeneratedContent('');
                    document.forms[0].reset();
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Resume
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Resume Preview</h2>
              {generatedContent && (
                <div className="flex space-x-4">
                  <Button onClick={downloadPDF} variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button onClick={() => window.print()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Print Resume
                  </Button>
                </div>
              )}
            </div>
            <div
              id="resume-content"
              className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm min-h-[500px] print:shadow-none print:p-0 print:dark:bg-white print:dark:text-black"
              dangerouslySetInnerHTML={{ __html: generatedContent || '<p class="text-center text-muted-foreground">Generate your resume to see the preview here</p>' }}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}