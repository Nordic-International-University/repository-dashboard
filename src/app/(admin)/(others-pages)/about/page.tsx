import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Metadata } from 'next'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Admin Dashboard',
  description: 'Information about our company, mission, and team',
}

export default function AboutPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="About Us" />
      <div className="min-h-screen space-y-6">
        {/* Main About Section */}
        <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Our Company
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Learn more about who we are and what we do
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative mx-auto h-60 w-full overflow-hidden rounded-lg sm:h-80">
              <Image
                src="/images/grid-image/image-01.png"
                alt="Company Image"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to our company! We are a dedicated team of professionals committed to
              delivering high-quality solutions to our clients. Our mission is to provide innovative
              products and services that exceed expectations and help our customers achieve their
              goals.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Founded in 2020, we have quickly grown to become a leader in our industry, thanks to
              our focus on customer satisfaction, technological innovation, and operational
              excellence.
            </p>
          </CardContent>
        </Card>

        {/* Mission and Vision */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Our mission is to empower businesses with cutting-edge technology solutions that
                drive growth and efficiency. We strive to be a trusted partner for our clients,
                helping them navigate the complexities of the digital landscape.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We envision a future where technology seamlessly integrates with business processes,
                enabling organizations of all sizes to achieve their full potential. Our goal is to
                be at the forefront of this transformation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Our Team
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Meet the people behind our success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/images/user/user-01.jpg"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">John Doe</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chief Executive Officer</p>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/images/user/user-02.jpg"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">Jane Smith</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chief Technology Officer</p>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/images/user/user-03.png"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Michael Johnson
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chief Marketing Officer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Contact Us
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Get in touch with our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              We'd love to hear from you! Whether you have a question about our services, need
              technical support, or want to explore partnership opportunities, our team is ready to
              assist you.
            </p>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Email:</span> info@company.com
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Phone:</span> +1 (123) 456-7890
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Address:</span> 123 Business Street, Tech City, TC
                12345
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-brand-500 hover:bg-brand-600 text-white">Contact Us</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
