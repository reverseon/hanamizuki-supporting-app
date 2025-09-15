# Ishiori Landing Page Tasks

namespace :ishiori_landing_page do
  desc "ishiori-landing-page pipeline tasks"
  # ===== Development Environment Tasks =====
  task :dev_up do
    puts "Starting ishiori-landing-page development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../ishiori-landing-page/docker", __dir__)
    
    # Run docker compose up with build in detached mode
    system("cd #{docker_dir} && docker compose -f dev.yaml up --build -d")
  end
  
  desc "Stop ishiori-landing-page development environment"
  task :dev_down do
    puts "Stopping ishiori-landing-page development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../ishiori-landing-page/docker", __dir__)
    
    # Run docker compose down with volume removal
    system("cd #{docker_dir} && docker compose -f dev.yaml down -v")
  end
  
  desc "Rebuild and restart ishiori-landing-page development environment"
  task :dev_restart do
    puts "Restarting ishiori-landing-page development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../ishiori-landing-page/docker", __dir__)
    
    # Stop with volume removal, rebuild, and start in detached mode
    system("cd #{docker_dir} && docker compose -f dev.yaml down -v && docker compose -f dev.yaml up --build -d")
  end
  
  # ===== Production Testing Tasks =====
  desc "Start ishiori-landing-page production test environment"
  task :prod_test_up do
    puts "Starting ishiori-landing-page production test environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../ishiori-landing-page/docker", __dir__)
    
    # Build and run production image locally for testing
    puts "Building production image for testing..."
    system("cd #{docker_dir} && docker compose -f prod-test.yaml up --build -d")
    
    if $?.exitstatus == 0
      puts "Production test environment started successfully!"
      puts "Application should be available at: http://localhost:2434"
      puts "Use 'bundle exec rake ishiori_landing_page:prod_test_health' to check health"
      puts "Use 'bundle exec rake ishiori_landing_page:prod_test_down' to stop"
    else
      puts "Error: Failed to start production test environment"
      exit 1
    end
  end
  
  desc "Stop ishiori-landing-page production test environment"
  task :prod_test_down do
    puts "Stopping ishiori-landing-page production test environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../ishiori-landing-page/docker", __dir__)
    
    # Stop containers and remove volumes
    system("cd #{docker_dir} && docker compose -f prod-test.yaml down -v")
    
    puts "Production test environment stopped."
  end
  
  desc "Check health of ishiori-landing-page production test environment"
  task :prod_test_health do
    puts "Checking ishiori-landing-page production test health..."
    
    # Test the health endpoint
    health_url = "http://localhost:2434/"
    
    puts "Testing endpoint: #{health_url}"
    
    # Use curl to test the endpoint
    result = system("curl -f -s --max-time 10 #{health_url} > /dev/null")
    
    if result
      puts "✅ Health check PASSED - Production build is running correctly"
      
      # Show some additional info
      puts "\nTesting additional endpoints:"
      system("curl -s -I http://localhost:2434/ | head -1 || echo 'Root endpoint check failed'")
      
    else
      puts "❌ Health check FAILED - Production build may not be running or healthy"
      puts "Try running: bundle exec rake ishiori_landing_page:prod_test_logs"
      exit 1
    end
  end
  
  desc "Show logs from ishiori-landing-page production test environment"
  task :prod_test_logs do
    puts "Showing ishiori-landing-page production test logs..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../ishiori-landing-page/docker", __dir__)
    
    # Show logs
    system("cd #{docker_dir} && docker compose -f prod-test.yaml logs -f")
  end
  
  desc "Run complete production test cycle (build, start, test, stop)"
  task :prod_test_cycle do
    puts "Running complete ishiori-landing-page production test cycle..."
    
    begin
      # Stop any existing test environment
      Rake::Task["ishiori_landing_page:prod_test_down"].invoke
      
      # Start production test environment
      Rake::Task["ishiori_landing_page:prod_test_up"].invoke
      
      # Wait a bit for the service to start
      puts "Waiting for service to start..."
      sleep 10
      
      # Run health check
      Rake::Task["ishiori_landing_page:prod_test_health"].invoke
      
      puts "✅ Production test cycle completed successfully!"
      puts "The production build is ready for staging deployment."
      
    rescue => e
      puts "❌ Production test cycle failed: #{e.message}"
      puts "Check logs with: bundle exec rake ishiori_landing_page:prod_test_logs"
      exit 1
    ensure
      # Always stop the test environment
      puts "Cleaning up test environment..."
      Rake::Task["ishiori_landing_page:prod_test_down"].invoke
    end
  end
  
  # ===== Production Environment Tasks [ Please Execute This Only in Main Branch ]=====
  task :push_latest_to_ecr do
    puts "Pushing latest ishiori-landing-page image to ECR..."
    
    # Configuration
    aws_profile = "ishiori1gp"
    ecr_registry = "public.ecr.aws/p1f1p2p3"
    ecr_repo = "ishiori-k8s-public-ecr"
    app_name = "ishiori-landing-page"
    
    # Change to the ishiori-landing-page directory
    ishiori_landing_page_dir = File.expand_path("../../ishiori-landing-page", __dir__)
    
    # Get current commit hash
    commit_hash = `cd #{ishiori_landing_page_dir} && git rev-parse --short HEAD`.strip
    
    if commit_hash.empty?
      puts "Error: Could not get commit hash"
      exit 1
    end
    
    puts "Current commit hash: #{commit_hash}"
    
    # Authenticate to ECR Public
    puts "Authenticating to ECR Public..."
    system("aws ecr-public get-login-password --region us-east-1 --profile #{aws_profile} | docker login --username AWS --password-stdin #{ecr_registry}")
    
    # Build image with commit hash tag
    image_tag = "#{app_name}_#{commit_hash}"
    full_image_name = "#{ecr_registry}/#{ecr_repo}:#{image_tag}"
    
    puts "Building Docker image: #{full_image_name}"
    system("cd #{ishiori_landing_page_dir} && docker build -t #{full_image_name} -f docker/Dockerfile .")
    
    if $?.exitstatus != 0
      puts "Error: Docker build failed"
      exit 1
    end
    
    # Push image to ECR
    puts "Pushing image to ECR: #{full_image_name}"
    system("docker push #{full_image_name}")
    
    if $?.exitstatus != 0
      puts "Error: Docker push failed"
      exit 1
    end
    
    puts "Successfully pushed #{full_image_name} to ECR"
  end
end