# Title

## Delete this after cloning the template

### Vars to replace
To get started with the template, please replace the following (do a `ctrl+f` in each file and replace these values):

| File Name     | Variables     |  
| ------------- |-------------:| 
| **`files/api_file_name.yaml`**| `<app_name>`, `<api_fqdn>`, `<function_name>`, `<other_path>`
| **`template.yml`**| `<app_name>`, `<Some description here>`, `<api_name>`, `<prefix>`, `<function_name>`, `<lambda_function_name>`, `<api_method_path>`, `<custom_domain>`
| **`pipeline/pipeline.yaml`**| `<pipeline_repo_name>`, `<app_name>`
| **`README.md`**| `<codepipeline_stack_name>`, `<app_name>`
| **`/pipeline/Pipeline-Instructions.md`**| `<app_name>`

### Files to rename
* `files/api_file_name.yaml` - name of your API Swagger definition
* `handlers/function_name` - the name of your lambda function. You can add more functions, then add them to `/template.yml`

**advanced**
* `/stage_vars.json`: to change variables at pipeline run time
* `/template_vars.json`: to change variables at pipeline run time (see `ParameterOverrides` section in `pipelines/pipeline.yaml`)

| **Note**: if you rename any files in the `advanced` section above, be sure to modify them in the `/buildspec.yml` file.

### Decription

The app is set in a pipeline with 2 build environments in AWS `dev`, `prod`.

### Architecture
![architecture](arch_image.png)

### Configuration Structure

#### Github Repo structure

- -- main ---> codeBuild-ProdEnv -> API (with API Key), Lambda deployed.
- -- dev ---> codeBuild-DevEnv -> API (with API Key), Lambda deployed. This requires manual approval in AWS.

### CodePipeline config

- This is the `/pipleine/pipelina.yaml` file
    - Creates 2 sets of IAM roles for all 2 environments
    - Creates dev and prod codebuild environments
    - Creates a pipleine with a github webhook to the respective branches


To create this stack:
```
aws cloudformation create-stack --stack-name <codepipeline_stack_name> --template-body file://pipeline/pipeline.yaml --capabilities CAPABILITY_NAMED_IAM --profile <if_not_using_default>

```

To modify this stack:
```
aws cloudformation update-stack --stack-name <codepipeline_stack_name> --template-body file://pipeline/pipeline.yaml --capabilities CAPABILITY_NAMED_IAM --profile <if_not_using_default>

```
To modify the github repo name:
```
aws ssm put-parameter --name "/service/<app_name>-pipeline/github/repo"--description "Github Repository name for Cloudformation Stack <codepipeline_stack_name>"--type "String"--value "<enter_value_here>" --profile <if_not_using_default>
```
To modify the github repo key:
```
aws ssm put-parameter --name "/service/<app_name>-pipeline/github/token"--description "Github Token for Cloudformation Stack <codepipeline_stack_name>"--type "String"--value "<new_key>" --profile <if_not_using_default>
```
To modify the github repo user (personal or company):
```
aws ssm put-parameter  --name "/service/<app_name>-pipeline/github/user"  --description "Github Username for Cloudformation Stack <codepipeline_stack_name>"  --type "String"  --value "<username>" --profile <if_not_using_default> --overwrite
```
`Don't forget to commit then merge branches` <- this will trigger the entire app (not codepipeline) pipeline.

### AWS SAM template config

This is the template used to build out the infra for the API and functions, including API stages and stage mapping.

#### API Config
- API infra config is defined in the AWS::Api section in the `template.yaml` file
- API detailed config is in the `files/<api_file_name>.yaml` file, defined in Swagger

#### Functions Config
- Function infra definition is in the AWS::Function resources section in the `template.yaml` file. Here you can change tags, memory, etc on the lambda functions
- The code is located in the `src/handlers` folder.