# K8s Dex Client Tasks

namespace :k8s_dex_client do
  desc "k8s-dex-client pipeline tasks"
  # ===== Development Environment Tasks =====
  task :dev_up do
    puts "Starting k8s-dex-client development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../k8s-dex-client/docker", __dir__)
    
    # Run docker compose up with build in detached mode
    system("cd #{docker_dir} && docker compose -f dev.yaml up --build -d")
  end
  
  desc "Stop k8s-dex-client development environment"
  task :dev_down do
    puts "Stopping k8s-dex-client development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../k8s-dex-client/docker", __dir__)
    
    # Run docker compose down with volume removal
    system("cd #{docker_dir} && docker compose -f dev.yaml down -v")
  end
  
  desc "Rebuild and restart k8s-dex-client development environment"
  task :dev_restart do
    puts "Restarting k8s-dex-client development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../k8s-dex-client/docker", __dir__)
    
    # Stop with volume removal, rebuild, and start in detached mode
    system("cd #{docker_dir} && docker compose -f dev.yaml down -v && docker compose -f dev.yaml up --build -d")
  end
  # ===== Production Environment Tasks [ Please Execute This Only in Main Branch ]=====
  task :push_latest_to_ecr do
    puts "Pushing latest k8s-dex-client image to ECR..."
    
    # Configuration
    aws_profile = "ishiori1gp"
    ecr_registry = "319844025384.dkr.ecr.ap-northeast-1.amazonaws.com"
    ecr_repo = "ishiori-k8s-private-ecr"
    app_name = "k8s-dex-client"
    
    # Change to the k8s-dex-client directory
    k8s_client_dir = File.expand_path("../../k8s-dex-client", __dir__)
    
    # Get current commit hash
    commit_hash = `cd #{k8s_client_dir} && git rev-parse --short HEAD`.strip
    
    if commit_hash.empty?
      puts "Error: Could not get commit hash"
      exit 1
    end
    
    puts "Current commit hash: #{commit_hash}"
    
    # Authenticate to ECR
    puts "Authenticating to ECR..."
    system("aws ecr get-login-password --region ap-northeast-1 --profile #{aws_profile} | docker login --username AWS --password-stdin #{ecr_registry}")
    
    # Build image with commit hash tag
    image_tag = "#{app_name}_#{commit_hash}"
    full_image_name = "#{ecr_registry}/#{ecr_repo}:#{image_tag}"
    
    puts "Building Docker image: #{full_image_name}"
    system("cd #{k8s_client_dir} && docker build -t #{full_image_name} -f docker/Dockerfile .")
    
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