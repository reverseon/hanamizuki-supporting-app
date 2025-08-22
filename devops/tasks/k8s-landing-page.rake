# K8s Landing Page Tasks

namespace :k8s_landing_page do
  desc "k8s-landing-page pipeline tasks"
  # ===== Development Environment Tasks =====
  task :dev_up do
    puts "Starting k8s-landing-page development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../k8s-landing-page/docker", __dir__)
    
    # Run docker compose up with build in detached mode
    system("cd #{docker_dir} && docker compose -f dev.yaml up --build -d")
  end
  
  desc "Stop k8s-landing-page development environment"
  task :dev_down do
    puts "Stopping k8s-landing-page development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../k8s-landing-page/docker", __dir__)
    
    # Run docker compose down with volume removal
    system("cd #{docker_dir} && docker compose -f dev.yaml down -v")
  end
  
  desc "Rebuild and restart k8s-landing-page development environment"
  task :dev_restart do
    puts "Restarting k8s-landing-page development environment..."
    
    # Change to the docker directory
    docker_dir = File.expand_path("../../k8s-landing-page/docker", __dir__)
    
    # Stop with volume removal, rebuild, and start in detached mode
    system("cd #{docker_dir} && docker compose -f dev.yaml down -v && docker compose -f dev.yaml up --build -d")
  end
end